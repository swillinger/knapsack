const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const { ApolloServer, gql } = require('apollo-server-express');
const urlJoin = require('url-join');
const fs = require('fs-extra');
const { join, relative } = require('path');
const md = require('marked');
const highlight = require('highlight.js');
const GraphQLJSON = require('graphql-type-json');
const { wrapHtml } = require('./templates');
const log = require('../cli/log');
const { USER_SITE_PUBLIC } = require('../lib/constants');
const { enableTemplatePush, enableUiSettings } = require('../lib/features');
// const { PatternSchema } = require('../../dist/schemas/pattern');
// const { PatternMetaSchema } = require('../../dist/schemas/pattern-meta');

// https://marked.js.org/#/USING_ADVANCED.md
md.setOptions({
  highlight: code => highlight.highlightAuto(code).value,
});

class BedrockApiServer {
  // config: BedrockApiServerConfig;

  // endpoints: Endpoint[];

  // app: express.Express;

  // wss: WebSocket.Server;

  /**
   * @param {BedrockApiServerConfig} userConfig - Users Config
   */
  constructor(userConfig) {
    const {
      /** @type {ExampleStore} */
      exampleStore,
      /** @type {BedrockPatternManifest} */
      patternManifest,
      settingsStore,
    } = userConfig;

    this.config = userConfig;

    const typeDefs = gql`
      scalar JSON
      type Meta {
        websocketPort: Int
      }

      type SettingsParentBrand {
        "URL to image"
        logo: String
        title: String
        homepage: String
      }

      type Settings {
        title: String!
        subtitle: String
        slogan: String
        parentBrand: SettingsParentBrand
      }

      type PatternDoAndDontItem {
        image: String!
        caption: String
        do: Boolean!
      }

      "Visual representations of what to do, and not to do, with components."
      type PatternDoAndDont {
        title: String
        description: String
        items: [PatternDoAndDontItem!]!
      }

      type PatternTemplate {
        name: String!
        "JSON Schema"
        schema: JSON
        "CSS Selector"
        selector: String
        uiSchema: JSON
        isInline: Boolean
      }

      enum PatternType {
        component
        layout
      }

      enum PatternStatus {
        draft
        inProgress
        ready
      }

      enum PatternUses {
        inSlice
        inGrid
        inComponent
      }

      enum PatternDemoSize {
        s
        m
        l
        full
      }

      type PatternMeta {
        title: String!
        description: String
        type: PatternType
        status: PatternStatus
        uses: [PatternUses]
        demoSize: PatternDemoSize
        hasIcon: Boolean
        dosAndDonts: [PatternDoAndDont]
      }

      type Pattern {
        id: ID!
        "Relative path to a JSON file that stores meta data for pattern. Schema for that file is in pattern-meta.schema.json."
        metaFilePath: String
        templates: [PatternTemplate]!
        meta: PatternMeta
      }

      type ExampleSlice {
        id: ID!
        patternId: ID!
        data: JSON!
      }

      type Example {
        id: ID!
        title: String!
        path: String!
        slices: [ExampleSlice!]!
      }

      # The "Query" type is the root of all GraphQL queries.
      type Query {
        example(id: ID): Example
        examples: [Example]
        setExample(id: ID, data: JSON): Example
        meta: Meta
        patterns: [Pattern]
        pattern(id: ID): Pattern
        settings: Settings
        setSettings(settings: JSON): Settings
        setSetting(setting: String, value: String): Settings
      }
    `;

    const resolvers = {
      example: (root, { id }) => exampleStore.getExample(id),
      setExample: async (root, { id, data }) => {
        await exampleStore.setExample(id, data);
        return exampleStore.getExample(id);
      },
      examples: () => exampleStore.getExamples(),
      patterns: () => patternManifest.getPatterns(),
      pattern: (root, { id }) => patternManifest.getPattern(id),
      settings: () => settingsStore.getSettings(),
      setSettings: (parent, { settings }) => {
        settingsStore.setSettings(settings);
        return settingsStore.getSettings();
      },
      setSetting: (parent, { setting, value }) => {
        settingsStore.setSetting(setting, value);
        return settingsStore.getSettings();
      },
    };

    const gqlServer = new ApolloServer({
      typeDefs,
      resolvers: {
        Query: {
          ...resolvers,
          meta: () => ({
            websocketPort: this.config.websocketsPort,
          }),
        },
        JSON: GraphQLJSON,
      },
    });

    /** @type {Endpoint[]} */
    this.endpoints = [];

    this.app = express();

    this.app.use(bodyParser.json());

    gqlServer.applyMiddleware({ app: this.app });

    this.app.use('*', (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
      );
      next();
    });

    if (this.config.webroot) {
      this.app.use(express.static(this.config.webroot));
      // Since this is a Single Page App, we will send all html requests to the `index.html` file in the webroot
      this.app.use('*', (req, res, next) => {
        const { accept = '' } = req.headers;
        const accepted = accept.split(',');
        if (accepted.includes('text/html')) {
          res.sendFile(join(this.config.webroot, 'index.html'));
        } else {
          next();
        }
      });
    }

    if (this.config.public) {
      this.app.use(USER_SITE_PUBLIC, express.static(this.config.public));
    }

    if (this.config.staticDirs) {
      this.config.staticDirs.forEach(staticDir =>
        this.app.use(staticDir.prefix, express.static(staticDir.path)),
      );
    }

    this.app.get(this.config.baseUrl, (req, res) => {
      res.json({
        ok: true,
        message: 'Welcome to the API!',
      });
    });

    if (this.config.designTokens) {
      this.config.designTokens.forEach(designToken => {
        const url = urlJoin(
          this.config.baseUrl,
          'design-token',
          designToken.id,
        );
        // console.log(`Setting up "${url}" api endpoint...`);
        this.registerEndpoint(url);
        this.app.get(url, async (req, res) => {
          try {
            const tokens = await designToken.get(req.query);
            // console.log(`Responding on "${url}" api endpoint with: `, tokens);
            res.send({
              ok: true,
              data: tokens,
            });
          } catch (err) {
            res.send({
              ok: false,
              message: err.toString(),
            });
          }
        });
      });

      const url2 = urlJoin(this.config.baseUrl, 'design-tokens');
      this.registerEndpoint(url2);
      this.app.get(url2, async (req, res) => {
        res.send(this.config.designTokens);
      });
    }

    if (this.config.templateRenderers) {
      const url = urlJoin(this.config.baseUrl, '/render');
      // console.log(`Setting up "${url}" api endpoint...`);
      this.registerEndpoint(url, 'POST');
      this.app.post(url, async (req, res) => {
        const { body } = req;
        const { type } = req.query;
        if (!type) {
          console.error('Error: not enough info to render template');
          res.status(400).send({
            ok: false,
            message: 'Request not formatted correctly.',
          });
        }

        const {
          /** @type {string} */
          template,
          /** @type {Object} */
          data,
        } = body;

        const renderer = this.config.templateRenderers.find(t =>
          t.test(template),
        );
        // const renderer = this.config.templateRenderers.find(t => t.test(template));
        if (!renderer) {
          console.error(
            'Error: no template renderer found to handle this template',
          );
          res.status(400).send({
            ok: false,
            message: 'No template renderer found to handle this template',
          });
        }

        let results;
        switch (type) {
          case 'renderString':
            results = await renderer.renderString(template, data);
            break;
          case 'renderFile':
            results = await renderer.render(template, data);
            break;
          default:
            results = {
              ok: false,
              message: 'No valid "type" of request sent.',
            };
        }

        // @todo allow query param on API request to toggle
        const wrapHtmlResults = true;
        if (results.ok && wrapHtmlResults) {
          const cssUrls = this.config.css
            ? this.config.css.map(css =>
                join(USER_SITE_PUBLIC, relative(this.config.public, css)),
              )
            : [];
          const jsUrls = this.config.js
            ? this.config.js.map(js =>
                join(USER_SITE_PUBLIC, relative(this.config.public, js)),
              )
            : [];
          results.html = wrapHtml(results.html, cssUrls, jsUrls);
        }

        res.json(results);
      });
    }

    if (patternManifest) {
      const url1 = urlJoin(this.config.baseUrl, 'pattern/:id');
      this.registerEndpoint(url1);
      this.app.get(url1, async (req, res) => {
        const results = await patternManifest.getPattern(req.params.id);
        res.send(results);
      });

      const url2 = urlJoin(this.config.baseUrl, 'patterns');
      this.registerEndpoint(url2);
      this.app.get(url2, async (req, res) => {
        const results = await patternManifest.getPatterns();
        res.send(results);
      });

      const url3 = urlJoin(this.config.baseUrl, 'pattern-meta/:id');
      this.registerEndpoint(url3);
      this.app.get(url3, async (req, res) => {
        const results = await patternManifest.getPatternMeta(req.params.id);
        res.send(results);
      });

      const url4 = urlJoin(this.config.baseUrl, 'pattern-meta/:id');
      this.registerEndpoint(url4, 'POST');
      this.app.post(url4, async (req, res) => {
        const results = await patternManifest.setPatternMeta(
          req.params.id,
          req.body,
        );
        res.send(results);
      });

      const url5 = urlJoin(this.config.baseUrl, 'new-pattern');
      this.registerEndpoint(url5, 'POST');
      this.app.post(url5, async (req, res) => {
        const results = await patternManifest.createPatternFiles(req.body);
        res.send(results);
      });
    }

    if (exampleStore) {
      const url1 = urlJoin(this.config.baseUrl, '/example/:id');
      this.registerEndpoint(url1);
      this.app.get(url1, async (req, res) => {
        try {
          const example = await exampleStore.getExample(req.params.id);
          res.send({
            ok: true,
            example,
          });
        } catch (error) {
          if (error.code === 'ENOENT') {
            res.send({
              ok: false,
              message: `Example "${req.params.id}" not found.`,
            });
          } else {
            res.send({
              ok: false,
              message: error.toString(),
            });
          }
        }
      });

      const url2 = urlJoin(this.config.baseUrl, '/example/:id');
      this.registerEndpoint(url2, 'POST');
      this.app.post(url2, async (req, res) => {
        const results = await exampleStore.setExample(req.params.id, req.body);
        res.send(results);
      });

      const url3 = urlJoin(this.config.baseUrl, '/examples');
      this.registerEndpoint(url3);
      this.app.get(url3, async (req, res) => {
        const results = await exampleStore.getExamples();
        res.send(results);
      });
    } else {
      this.app.get(
        urlJoin(this.config.baseUrl, '/examples'),
        async (req, res) => {
          res.send([]);
        },
      );
    }

    if (this.config.sections) {
      this.config.sections.forEach(section => {
        const url = urlJoin(this.config.baseUrl, `section/${section.id}/:id`);
        this.registerEndpoint(url);
        this.app.get(url, async (req, res) => {
          const item = section.items.find(x => x.id === req.params.id);
          if (!item) {
            res.send({
              ok: false,
              message: `Item ${req.params.id} not found`,
            });
          }
          const contents = await fs.readFile(item.src, 'utf8');
          const isMarkdown = item.src.endsWith('.md');
          res.send({
            ok: true,
            data: {
              ...item,
              contents: isMarkdown ? md(contents) : contents,
            },
          });
        });
      });
    }

    const url2 = urlJoin(this.config.baseUrl, 'sections');
    this.registerEndpoint(url2);
    this.app.get(url2, async (req, res) => {
      const { sections = [] } = this.config;
      res.send(sections);
    });

    const url3 = urlJoin(this.config.baseUrl, 'settings');
    this.registerEndpoint(url3);
    this.app.get(url3, async (req, res) => {
      const settings = settingsStore.getSettings();
      res.send(settings);
    });

    if (enableUiSettings) {
      const url4 = urlJoin(this.config.baseUrl, 'settings');
      this.registerEndpoint(url4, 'POST');
      this.app.post(url4, async (req, res) => {
        const results = settingsStore.setSettings(req.body);
        res.send(results);
      });
    }

    if (this.config.websocketsPort && enableTemplatePush) {
      this.wss = new WebSocket.Server({
        port: this.config.websocketsPort,
        clientTracking: true,
      });
    }

    const url5 = urlJoin(this.config.baseUrl, 'meta');
    this.registerEndpoint(url5);
    this.app.get(url5, (req, res) => {
      res.send({
        websocketsPort: this.config.websocketsPort,
      });
    });
  }

  static getExpress() {
    return express;
  }

  getApp() {
    return this.app;
  }

  /**
   * @param {string} pathname - URL Endpoint path
   * @param {'GET' | 'POST'} [method='GET'] - HTTP method
   * @returns {void}
   */
  registerEndpoint(pathname, method = 'GET') {
    this.endpoints.push({
      pathname,
      method,
    });
  }

  /**
   * @param {Object} data - Data to send to Websocket client
   * @returns {boolean} - if successful
   * @todo improve `data` definition
   */
  announcePatternChange(data) {
    if (!this.wss) {
      console.error(
        'Attempted to fire "announcePatternChange" but no WebSockets Server setup due to lack of "websocketsPort" in config',
      );
      return false;
    }
    // console.log('announcePatternChange...');
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
    return true;
  }

  listen() {
    const { app, config, endpoints } = this;
    const { showEndpoints, port } = config;

    // console.log({ endpoints });
    app.listen(port, () => {
      if (showEndpoints) {
        log.dim(
          `Available endpoints: \n${endpoints
            .map(e => ` ${e.pathname} (${e.method})`)
            .join('\n')}`,
        );
      }
      setTimeout(() => {
        log.success(`🚀 Server listening on http://localhost:${port}`);
      }, 250);
    });
  }
}

module.exports = BedrockApiServer;
