const portfinder = require('portfinder');
const BedrockApiServer = require('./bedrock-api-server');
const BedrockPatternManifest = require('./pattern-manifest/bedrock-pattern-manifest');
const ExampleStore = require('./example-store');
const SettingsStore = require('./settings-store');
const DesignTokensStore = require('./design-tokens-store');
// const { BedrockConfig } = require('../../schemas/bedrock-config');

/**
 * @param {BedrockConfig} config
 * @returns {Promise<void>}
 */
async function serve(config) {
  const settingsStore = new SettingsStore({ dataDir: config.data });

  const patternManifest = new BedrockPatternManifest({
    newPatternDir: config.newPatternDir,
    patternPaths: config.src,
    dataDir: config.data,
  });

  const exampleStore = new ExampleStore({
    dir: config.data,
  });

  const designTokensStore = new DesignTokensStore({
    tokenPath: config.designTokens,
  });
  const tokens = {
    tokens: await designTokensStore.getTokens(),
    categories: await designTokensStore.getCategories(),
  };

  const apiServer = new BedrockApiServer({
    port: 3999,
    webroot: config.dist,
    public: config.public,
    websocketsPort: await portfinder.getPortPromise(),
    baseUrl: '/api',
    showEndpoints: true,
    designTokens: tokens.categories.map(category => {
      const theseTokens = tokens.tokens.filter(
        token => token.category === category,
      );
      return {
        id: category,
        meta: {
          title: category,
          description: `Description for ${category}`,
        },
        get: () => Promise.resolve(theseTokens),
      };
    }),
    patternManifest,
    templateRenderers: config.templates,
    exampleStore,
    settingsStore,
    css: config.css,
    js: config.js,
  });

  patternManifest.watch(({ event, path }) => {
    apiServer.announcePatternChange({ event, path });
  });

  apiServer.listen();
}

module.exports = {
  serve,
};
