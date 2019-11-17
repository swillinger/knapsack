/**
 *  Copyright (C) 2018 Basalt
    This file is part of Knapsack.
    Knapsack is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Knapsack is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Knapsack; if not, see <https://www.gnu.org/licenses>.
 */
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { makeExecutableSchema, mergeSchemas } from 'graphql-tools';
import WebSocket from 'ws';
import bodyParser from 'body-parser';
import { join } from 'path';
import * as log from '../cli/log';
import { EVENTS, knapsackEvents } from './events';
import { getApiRoutes } from './rest-api';
import { setupRoutes } from './routes';
import { enableTemplatePush } from '../lib/features';
import { getRole } from './auth';
import { apiUrlBase, PERMISSIONS, HTTP_STATUS } from '../lib/constants';
import {
  pageBuilderPagesResolvers,
  pageBuilderPagesTypeDef,
} from './page-builder';
import { designTokensResolvers, designTokensTypeDef } from './design-tokens';
import { getBrain } from '../lib/bootstrap';
import { GraphQlContext, KnapsackMeta } from '../schemas/misc';
import { WS_EVENTS, WebSocketMessage } from '../schemas/web-sockets';

export async function serve({ meta }: { meta: KnapsackMeta }): Promise<void> {
  const {
    patterns,
    customPages,
    pageBuilderPages,
    settings,
    tokens,
    navs,
    config,
    assetSets,
  } = getBrain();
  const port = process.env.KNAPSACK_PORT || 3999;
  const knapsackDistDir = join(__dirname, '../../dist/client');

  const metaTypeDef = gql`
    type Meta {
      websocketsPort: Int!
      knapsackVersion: String
      changelog: String
      version: String
    }

    type Query {
      meta: Meta
    }
  `;

  const metaResolvers = {
    Query: {
      meta: (): KnapsackMeta => meta,
    },
  };

  const gqlServer = new ApolloServer({
    schema: mergeSchemas({
      schemas: [
        makeExecutableSchema({
          typeDefs: pageBuilderPagesTypeDef,
          resolvers: pageBuilderPagesResolvers,
        }),
        makeExecutableSchema({
          typeDefs: designTokensTypeDef,
          resolvers: designTokensResolvers,
        }),
        // makeExecutableSchema({
        //   typeDefs: patternsTypeDef,
        //   resolvers: patternsResolvers,
        // }),
        makeExecutableSchema({
          typeDefs: metaTypeDef,
          resolvers: metaResolvers,
        }),
      ],
    }),
    // https://www.apollographql.com/docs/apollo-server/essentials/data.html#context
    context: ({ req }): GraphQlContext => {
      // const { host, origin } = req.headers;
      // log.verbose('request received', { host, origin }, 'graphql');
      const role = getRole(req);
      const canWrite = role.permissions.includes(PERMISSIONS.WRITE);

      return {
        pageBuilderPages,
        settings,
        tokens,
        assetSets,
        navs,
        patterns,
        canWrite,
        customPages,
        config,
      };
    },
    playground: true,
    introspection: true,
  });

  const app = express();
  app.use(
    bodyParser.json({
      limit: '5000kb',
    }),
  );

  gqlServer.applyMiddleware({ app });

  const endpoints = [];

  function registerEndpoint(
    pathname: string,
    method: 'GET' | 'POST' = 'GET',
  ): void {
    endpoints.push({
      pathname,
      method,
    });
  }

  const restApiRoutes = getApiRoutes({
    registerEndpoint,
    webroot: config.dist,
    public: config.public,
    baseUrl: apiUrlBase,
    meta,
    patternManifest: patterns,
    templateRenderers: config.templateRenderers,
    pageBuilder: pageBuilderPages,
    settingsStore: settings,
    tokens,
  });

  app.use(restApiRoutes);

  type AppState = import('../client/store').AppState;
  type PartialAppState = Partial<AppState>;

  async function getDataStore(): Promise<PartialAppState> {
    return {
      settingsState: {
        settings: settings.getConfig(),
      },
      patternsState: {
        patterns: patterns.byId,
        templateStatuses: patterns.getTemplateStatuses(),
      },
      customPagesState: customPages.getConfig(),
      assetSetsState: assetSets.getData(),
      navsState: navs.getConfig(),
    };
  }

  async function handleNewDataStore(data: AppState) {
    try {
      await Promise.all([
        settings.write(data.settingsState.settings),
        customPages.write(data.customPagesState),
        navs.write(data.navsState),
      ]);
      return {
        ok: true,
        message: 'We got it!',
      };
    } catch (e) {
      console.error('handleNewDataStore', e);
      return {
        ok: false,
        message: `Could not handleNewDataStore. ${e.message}`,
      };
    }
  }

  app
    .route(`${apiUrlBase}/data-store`)
    .get(async (req, res) => {
      const role = getRole(req);
      const dataStore = await getDataStore();
      const fullDataStore: PartialAppState = {
        ...dataStore,
        userState: {
          role,
          canEdit: role.permissions.includes(PERMISSIONS.WRITE),
        },
        metaState: {
          meta,
        },
      };

      res.send(fullDataStore);
    })
    .post(async (req, res) => {
      const { permissions } = getRole(req);

      if (!permissions.includes(PERMISSIONS.WRITE)) {
        res.status(HTTP_STATUS.BAD.UNAUTHORIZED).send();
      } else {
        const results = await handleNewDataStore(req.body);
        if (results.ok) {
          res.status(HTTP_STATUS.GOOD.CREATED).send(results);
        } else {
          res.status(HTTP_STATUS.BAD.BAD_REQUEST).send(results);
        }
      }
    });

  const regularRoutes = setupRoutes({
    patterns,
    knapsackDistDir,
    distDir: config.dist,
    publicDir: config.public,
  });
  app.use(regularRoutes);

  /** @type {WebSocket.Server} */
  let wss;

  /**
   * @returns if successful
   */
  function sendWsMessage(msg: WebSocketMessage): boolean {
    if (!wss) {
      console.error(
        'Attempted to fire "sendWsMessage" but no WebSockets Server setup due to lack of "websocketsPort" in config',
      );
      return false;
    }
    log.verbose('sendWsMessage', msg, 'server');
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg));
      }
    });
    return true;
  }

  if (meta.websocketsPort && enableTemplatePush) {
    wss = new WebSocket.Server({
      port: meta.websocketsPort,
      clientTracking: true,
    });
  }

  app.listen(port, () => {
    log.silly('Available endpoints', endpoints, 'server');

    // want url to not get buried with info
    // @todo show this after event is fired from WebPack being ready
    setTimeout(() => {
      log.info(
        `🚀 Server listening on http://localhost:${port}`,
        null,
        'server',
      );
    }, 250);
  });

  if (enableTemplatePush && wss) {
    knapsackEvents.on(EVENTS.PATTERN_TEMPLATE_CHANGED, data => {
      setTimeout(() => {
        sendWsMessage({ event: WS_EVENTS.PATTERN_TEMPLATE_CHANGED, data });
      }, 100);
    });

    knapsackEvents.on(EVENTS.PATTERN_ASSET_CHANGED, data => {
      setTimeout(() => {
        sendWsMessage({ event: WS_EVENTS.PATTERN_ASSET_CHANGED, data });
      }, 100);
    });
  }
}
