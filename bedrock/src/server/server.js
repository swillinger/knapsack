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
const log = require('../cli/log');
const { bedrockEvents, EVENTS } = require('./events');
const { getRoutes } = require('./rest-api');
const { enableTemplatePush } = require('../lib/features');
const { getRole } = require('./auth');
const { PERMISSIONS, BASE_PATHS } = require('../lib/constants');
const {
  pageBuilderPagesTypeDef,
  pageBuilderPagesResolvers,
} = require('./page-builder');
const { settingsTypeDef, settingsResolvers } = require('./settings');
const { customPagesResolvers, customPagesTypeDef } = require('./custom-pages');
const { docsTypeDef, docsResolvers } = require('./docs');
const {
  designTokensTypeDef,
  designTokensResolvers,
} = require('./design-tokens');
const { patternsResolvers, patternsTypeDef } = require('./patterns');
const { getBrain } = require('../lib/bootstrap');

/**
 * @param {Object} opt
 * @param {BedrockMeta} opt.meta
 * @returns {Promise<void>}
 */
async function serve({ meta }) {
  const {
    patterns,
    customPages,
    pageBuilderPages,
    settings,
    tokens,
    docs,
    config,
  } = getBrain();
  const port = process.env.BEDROCK_PORT || 3999;
  const bedrockDistDir = join(__dirname, '../../dist/');

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
  });

  app.use(restApiRoutes);

  // This page is mainly so IE can get a list of links to view the individual templates outside of the system
  app.route('/demo-urls').get((req, res) => {
    const patternDemos = patterns.getPatternsDemoUrls();

    /* eslint-disable prettier/prettier */
    // disabling prettier so it's possible to keep indenting semi-similar to how it'd be done with templates, please try and keep it tidy and consistent!
    res.send(`
<ul>
${patternDemos
  .map(
    patternDemo => `
  <li>
    Pattern: <a href="${BASE_PATHS.PATTERN}/${
      patternDemo.id
    }" target="_blank">${patternDemo.title}</a>
    <ul>
      ${patternDemo.templates
        .map(
          template => `
        <li>
          Template: <a href="${BASE_PATHS.PATTERN}/${patternDemo.id}/${
            template.id
          }" target="_blank">${template.title}</a>
          <ul>
            ${template.demoUrls
              .map(
                (demoUrl, i) => `
              <li><a href="${demoUrl}" target="_blank">Demo Data ${i +
                  1}</a></li>
            `,
              )
              .join('\n')}
          </ul>
        </li>
      `,
        )
        .join('\n')}
    </ul>
  </li>
`,
  )
  .join('\n')}
</ul>
    `);
    /* eslint-enable prettier/prettier */
  });

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

    bedrockEvents.on(EVENTS.PATTERN_ASSET_CHANGED, ({ path }) => {
      setTimeout(() => {
        announcePatternChange({ event: 'changed', path });
      }, 100);
    });
  }
}

module.exports = {
  serve,
};
