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
import fetch from 'node-fetch';
import { join, relative } from 'path';
import { writeFile } from 'fs-extra';
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
import {
  GraphQlContext,
  KnapsackMeta,
  KnapsackFile,
  GenericResponse,
  KnapsackDataStoreSaveBody,
} from '../schemas/misc';
import { WS_EVENTS, WebSocketMessage } from '../schemas/web-sockets';
import { flattenArray } from '../lib/utils';

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
        settings: await settings.getData(),
      },
      patternsState: {
        patterns: patterns.byId,
        templateStatuses: await patterns.getTemplateStatuses(),
      },
      customPagesState: await customPages.getData(),
      assetSetsState: await assetSets.getData(),
      navsState: await navs.getData(),
    };
  }

  async function saveFilesLocally(
    files: KnapsackFile[],
  ): Promise<GenericResponse> {
    await Promise.all(
      files.map(({ contents, path, encoding }) =>
        writeFile(path, contents, { encoding }),
      ),
    );

    return {
      ok: true,
      message: 'All config files saved locally.',
    };
  }

  async function saveFilesToCloud({
    files,
    title = 'New changes',
    message,
  }: {
    files: KnapsackFile[];
    title?: string;
    message?: string;
  }): Promise<GenericResponse> {
    if (!config.cloud) {
      return {
        ok: false,
        message: 'No "cloud" in your "knapsack.config.js"',
      };
    }
    const { apiKey, apiBase, repoRoot, repoName, repoOwner } = config.cloud;

    interface Body {
      owner: string;
      repo: string;
      baseBranch: string;
      title: string;
      message?: string;
      payload?: {
        files: {
          path: string;
          contents: string;
        }[];
      };
    }

    const body: Body = {
      owner: repoOwner,
      repo: repoName,
      baseBranch: 'feature/users',
      title,
      message,
      // commitMessage: message ? [title, '', message].join('\n') : title,
      payload: {
        files: files.map(file => {
          return {
            ...file,
            path: relative(repoRoot, join(process.cwd(), file.path)),
          };
        }),
      },
    };
    console.log('Sending save request to Knapsack Cloud...');
    console.log(
      'files paths',
      body.payload.files.map(file => file.path).join('\n'),
    );
    const urlBase = apiBase.endsWith('/') ? apiBase : `${apiBase}/`;
    const results = await fetch(`${urlBase}api/save`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(async res => {
        const { ok, status, statusText } = res;
        console.log({ ok, status, statusText });
        if (!ok) {
          const result: GenericResponse = {
            ok,
            message: `${status} - ${statusText}`,
          };
          return result;
        }
        const data = await res.json();
        return {
          ok: true,
          message: `PR created at ${data.prUrl}`,
          data,
        };
      })
      .catch(e => {
        console.error('error saveFilesToCloud');
        console.error(e);
        const result: GenericResponse = {
          ok: false,
          message: `thrown error in saveFilesToCloud: ${e.message}`,
        };

        return result;
      });

    return results;
  }

  async function handleNewDataStore({
    state,
    title,
    message,
    storageLocation,
  }: KnapsackDataStoreSaveBody): Promise<GenericResponse> {
    try {
      const configFiles: KnapsackFile[] = await Promise.all([
        settings.savePrep(state.settingsState.settings),
        customPages.savePrep(state.customPagesState),
        navs.savePrep(state.navsState),
      ]).then(results => flattenArray(results));

      console.log('cloud', config.cloud);
      let results;
      switch (storageLocation) {
        case 'local': {
          results = await saveFilesLocally(configFiles);
          break;
        }
        case 'cloud': {
          if (config.cloud) {
            results = await saveFilesToCloud({
              files: configFiles,
              title,
              message,
            });
            break;
          } else {
            throw new Error(`No cloud config`);
          }
        }
        default:
          throw new Error(
            `Must declare save location, passed in ${storageLocation}`,
          );
      }
      // if (config.cloud) {
      //   results = await saveFilesToCloud(configFiles);
      // } else {
      //   results = await saveFilesLocally(configFiles);
      // }
      console.log('cloud results', results);

      return results;
    } catch (e) {
      console.error('handleNewDataStore', e);
      return {
        ok: false,
        message: `Could not handleNewDataStore. ${e.message}`,
      };
    }
  }

  app.get(`${apiUrlBase}/data-store`, async (req, res) => {
    const role = getRole(req);
    const dataStore = await getDataStore();
    const fullDataStore: PartialAppState = {
      ...dataStore,
      userState: {
        role,
        canEdit: role.permissions.includes(PERMISSIONS.WRITE),
        isLocalDev: process.env.NODE_ENV !== 'production',
      },
      metaState: {
        meta,
      },
    };

    res.send(fullDataStore);
  });

  app.post(`${apiUrlBase}/data-store`, async (req, res) => {
    const {
      state,
      title,
      message,
      storageLocation,
    } = req.body as KnapsackDataStoreSaveBody;

    if (!(storageLocation === 'local' || storageLocation === 'cloud')) {
      return res.status(HTTP_STATUS.BAD.BAD_REQUEST).send({
        ok: false,
        message: `loc param must be local or cloud, was: ${storageLocation}`,
      });
    }

    const { permissions } = getRole(req);

    if (!permissions.includes(PERMISSIONS.WRITE)) {
      res.status(HTTP_STATUS.BAD.UNAUTHORIZED).send();
    } else {
      const results = await handleNewDataStore({
        storageLocation,
        title,
        message,
        state,
      });
      console.log('handleNewDataStore results', results);

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
