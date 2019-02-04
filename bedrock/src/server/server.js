/**
 *  Copyright (C) 2018 Basalt
    This file is part of Bedrock.
    Bedrock is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Bedrock is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Bedrock; if not, see <https://www.gnu.org/licenses>.
 */
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { mergeSchemas, makeExecutableSchema } = require('graphql-tools');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const { join } = require('path');
const chokidar = require('chokidar');
const log = require('../cli/log');
const { bedrockEvents, EVENTS } = require('./events');
const { getRoutes } = require('./rest-api');
const { enableTemplatePush } = require('../lib/features');
const { getRole } = require('./auth');
const { PERMISSIONS } = require('../lib/constants');
const {
  PageBuilder,
  pageBuilderPagesTypeDef,
  pageBuilderPagesResolvers,
} = require('./page-builder');
const { Settings, settingsTypeDef, settingsResolvers } = require('./settings');
const {
  customPagesResolvers,
  customPagesTypeDef,
  CustomPages,
} = require('./custom-pages');
const { Docs, docsTypeDef, docsResolvers } = require('./docs');
const {
  DesignTokens,
  designTokensTypeDef,
  designTokensResolvers,
} = require('./design-tokens');
// Need `Pattens` in so JsDoc works
// eslint-disable-next-line no-unused-vars
const { Patterns, patternsResolvers, patternsTypeDef } = require('./patterns');

/**
 * @param {Object} opt
 * @param {BedrockConfig} opt.config
 * @param {Patterns} opt.patterns
 * @param {BedrockMeta} opt.meta
 * @returns {Promise<void>}
 */
async function serve({ config, meta, patterns }) {
  const port = process.env.BEDROCK_PORT || 3999;
  const bedrockDistDir = join(__dirname, '../../dist/');

  const settings = new Settings({ dataDir: config.data });
  const pageBuilderPages = new PageBuilder({ dataDir: config.data });
  const customPages = new CustomPages({ dataDir: config.data });
  const tokens = new DesignTokens(config.designTokens);
  const docs = new Docs({ docsDir: config.docsDir });

  const metaTypeDef = gql`
    type Meta {
      websocketsPort: Int!
      bedrockVersion: String
      changelog: String
      version: String
    }

    type Query {
      meta: Meta
    }
  `;

  const metaResolvers = {
    Query: {
      meta: () => meta,
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
          typeDefs: settingsTypeDef,
          resolvers: settingsResolvers,
        }),
        makeExecutableSchema({
          typeDefs: designTokensTypeDef,
          resolvers: designTokensResolvers,
        }),
        makeExecutableSchema({
          typeDefs: patternsTypeDef,
          resolvers: patternsResolvers,
        }),
        makeExecutableSchema({
          typeDefs: metaTypeDef,
          resolvers: metaResolvers,
        }),
        makeExecutableSchema({
          typeDefs: docsTypeDef,
          resolvers: docsResolvers,
        }),
        makeExecutableSchema({
          typeDefs: customPagesTypeDef,
          resolvers: customPagesResolvers,
        }),
      ],
    }),
    // https://www.apollographql.com/docs/apollo-server/essentials/data.html#context
    context: ({ req }) => {
      // const { host, origin } = req.headers;
      // log.verbose('request received', { host, origin }, 'graphql');
      const role = getRole(req);
      const canWrite = role.permissions.includes(PERMISSIONS.WRITE);

      return {
        pageBuilderPages,
        settings,
        tokens,
        docs,
        patterns,
        canWrite,
        customPages,
      };
    },
    // playground: true,
    // introspection: true,
  });

  const app = express();
  app.use(
    bodyParser.json({
      limit: '5000kb',
    }),
  );
  gqlServer.applyMiddleware({ app });

  app.use('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    next();
  });

  app.use(
    express.static(bedrockDistDir, {
      maxAge: '1d',
    }),
  );

  if (config.dist) {
    app.use(
      express.static(config.dist, {
        maxAge: '1d',
      }),
    );
  }

  if (config.public) {
    app.use(express.static(config.public));
  }

  // if (config.staticDirs) {
  //   config.staticDirs.forEach(staticDir =>
  //     app.use(staticDir.prefix, express.static(staticDir.path)),
  //   );
  // }

  // const designTokens = new DesignTokens({
  //   tokenPath: config.designTokens,
  // });

  // const tokens = {
  //   tokens: await designTokens.getTokens(),
  //   categories: await designTokens.allCategoriesUsed,
  // };

  const endpoints = [];

  /**
   * @param {string} pathname - URL Endpoint path
   * @param {'GET' | 'POST'} [method='GET'] - HTTP method
   * @returns {void}
   */
  function registerEndpoint(pathname, method = 'GET') {
    endpoints.push({
      pathname,
      method,
    });
  }

  const restApiRoutes = getRoutes({
    registerEndpoint,
    webroot: config.dist,
    public: config.public,
    baseUrl: '/api',
    meta,
    patternManifest: patterns,
    templateRenderers: config.templateRenderers,
    pageBuilder: pageBuilderPages,
    settingsStore: settings,
    css: config.rootRelativeCSS,
    js: config.rootRelativeJs,
  });

  app.use(restApiRoutes);

  // Since this is a Single Page App, we will send all html requests to the `index.html` file in the dist
  app.use('*', (req, res, next) => {
    const { accept = '' } = req.headers;
    const accepted = accept.split(',');
    // this is for serving up a Netlify CMS folder if present
    if (!req.baseUrl.startsWith('/admin') && accepted.includes('text/html')) {
      res.sendFile(join(bedrockDistDir, 'index.html'));
    } else {
      next();
    }
  });

  /** @type {WebSocket.Server} */
  let wss;

  /**
   * @param {Object} data - Data to send to Websocket client
   * @returns {boolean} - if successful
   * @todo improve `data` definition
   */
  function announcePatternChange(data) {
    if (!wss) {
      console.error(
        'Attempted to fire "announcePatternChange" but no WebSockets Server setup due to lack of "websocketsPort" in config',
      );
      return false;
    }
    log.verbose('announcePatternChange', data, 'server');
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
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
    bedrockEvents.on(EVENTS.PATTERN_TEMPLATE_CHANGED, ({ path }) => {
      setTimeout(() => {
        announcePatternChange({ event: 'changed', path });
      }, 100);
    });

    const assetsToWatch = [...config.css, ...config.js].filter(
      file => !file.startsWith('http') || !file.startsWith('//'),
    );
    const watcher = chokidar.watch(assetsToWatch, { ignoreInitial: true });
    watcher.on('all', (event, path) => {
      setTimeout(() => {
        announcePatternChange({ event, path });
      }, 100);
    });
  }
}

module.exports = {
  serve,
};
