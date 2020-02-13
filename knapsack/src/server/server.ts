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
import 'isomorphic-fetch';
import { join } from 'path';
import { writeFile, remove } from 'fs-extra';
import { KsUserInfo, KsFileSaver } from '@knapsack/core/dist/cloud';
import { KsCloudConnect } from '../cloud/cloud-connect';
import * as log from '../cli/log';
import { EVENTS, knapsackEvents } from './events';
import { getApiRoutes } from './rest-api';
import { setupRoutes } from './routes';
import { enableTemplatePush, getFeaturesForUser } from '../lib/features';
import { getUserInfo } from './auth';
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
import { flattenArray, isBase64 } from '../lib/utils';

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

  const port = process.env.KNAPSACK_PORT || meta.serverPort;
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
      const { role } = getUserInfo(req);
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
    config,
  });

  app.use(restApiRoutes);

  type AppState = import('../client/store').AppState;
  type PartialAppState = Partial<AppState>;

  async function getDataStore(): Promise<PartialAppState> {
    return {
      settingsState: {
        settings: await settings.getData(),
      },
      patternsState: await patterns.getData(),
      customPagesState: await customPages.getData(),
      assetSetsState: await assetSets.getData(),
      navsState: await navs.getData(),
    };
  }

  const fileSavers: Record<string, KsFileSaver> = {};

  async function saveFilesLocally({
    files,
  }: {
    files: KnapsackFile[];
  }): Promise<GenericResponse> {
    await Promise.all(
      files.map(({ contents, path, encoding, isDeleted }) => {
        if (isDeleted) {
          return remove(path);
        }
        switch (encoding) {
          case 'utf8':
            return writeFile(path, contents, { encoding });
          case 'base64': {
            const data = Buffer.from(contents, 'base64');
            return writeFile(path, data);
          }
          default:
            throw new Error(
              `Incorrect encoding used when saving files locally: "${encoding}" for file ${path}.`,
            );
        }
      }),
    );

    return {
      ok: true,
      message: 'All config files saved locally.',
    };
  }

  fileSavers.local = saveFilesLocally;

  if (config.cloud) {
    const { saveFilesToCloud } = new KsCloudConnect(config.cloud);
    fileSavers.cloud = saveFilesToCloud;
  }

  async function handleNewDataStore({
    state,
    title,
    message,
    storageLocation,
    user,
  }: KnapsackDataStoreSaveBody & { user: KsUserInfo }): Promise<
    GenericResponse
  > {
    const configFiles: KnapsackFile[] = await Promise.all([
      settings.savePrep(state.settingsState.settings),
      customPages.savePrep(state.customPagesState),
      navs.savePrep(state.navsState),
      patterns.savePrep(state.patternsState),
    ]).then(results => flattenArray(results));

    configFiles.forEach(configFile => {
      if (configFile.encoding === 'base64') {
        if (!isBase64(configFile.contents)) {
          console.log(configFile);
          throw new Error(
            `Pre-save check on Knapsack File "${configFile.path}" expected a base64 encoding and it is not.`,
          );
        }
      }
    });

    if (!fileSavers[storageLocation]) {
      throw new Error(
        `Must declare save location, passed in ${storageLocation}`,
      );
    }

    return fileSavers[storageLocation]({
      files: configFiles,
      title,
      message,
      user,
    });
  }

  app.get(`${apiUrlBase}/data-store`, async (req, res) => {
    const dataStore = await getDataStore();
    const userInfo = getUserInfo(req);
    const features = getFeaturesForUser(userInfo);
    log.verbose('features', features);
    const fullDataStore: PartialAppState = {
      ...dataStore,
      userState: {
        isLocalDev: process.env.NODE_ENV !== 'production',
        canEdit: process.env.NODE_ENV !== 'production',
        features,
      },
      metaState: {
        meta,
        plugins: config.plugins.map(p => {
          return {
            id: p.id,
            hasContent: !!p.loadContent,
            clientPluginPath: p.clientPluginPath
              ? join(`/plugins/${p.id}`, p.clientPluginPath)
              : null,
          };
        }),
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

    const isLocalDev =
      state.userState.isLocalDev && process.env.NODE_ENV === 'production';

    const user = getUserInfo(req);
    const permissions = user?.role?.permissions;

    if (
      !permissions.includes(PERMISSIONS.WRITE) &&
      !isLocalDev &&
      storageLocation !== 'local'
    ) {
      res.status(HTTP_STATUS.BAD.UNAUTHORIZED).send();
    } else {
      try {
        const results = await handleNewDataStore({
          storageLocation,
          title,
          message,
          state,
          user,
        });
        // console.log('handleNewDataStore results', results);
        res.send(results);
      } catch (e) {
        console.error('handleNewDataStore', e);
        res.status(HTTP_STATUS.FAIL.INTERNAL_ERROR).send({
          ok: false,
          message: `Could not handleNewDataStore. ${e.message}`,
        });
      }
    }
  });

  const regularRoutes = setupRoutes({
    patterns,
    knapsackDistDir,
    distDir: config.dist,
    publicDir: config.public,
    cacheDir: meta.cacheDir,
    plugins: config.plugins,
  });
  app.use(regularRoutes);

  let wss: WebSocket.Server;

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
    // wss.on('connection', ws => {
    //   ws.on('message', msg => {
    //     console.log('wss messge', msg);
    //   });
    // });
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
