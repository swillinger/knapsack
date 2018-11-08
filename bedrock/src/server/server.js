const BedrockApiServer = require('./bedrock-api-server');
const BedrockPatternManifest = require('./pattern-manifest/bedrock-pattern-manifest');
const ExampleStore = require('./example-store');
const { USER_SITE_PUBLIC } = require('../lib/constants');
// const { BedrockConfig } = require('../../schemas/bedrock-config');

/**
 * @param {BedrockConfig} config
 * @returns {Promise<void>}
 */
async function serve(config, { tokens }) {
  const patternManifest = new BedrockPatternManifest({
    newPatternDir: config.newPatternDir,
    patternPaths: config.src,
  });

  const exampleStore = new ExampleStore({
    dir: config.examplesDir,
  });

  const apiServer = new BedrockApiServer({
    port: 3999,
    webroot: config.dist,
    staticDirs: [
      {
        prefix: USER_SITE_PUBLIC,
        path: config.public,
      },
    ],
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
        get: () => theseTokens,
      };
    }),
    patternManifest,
    templateRenderers: config.templates,
    exampleStore,
  });

  patternManifest.watch(({ event, path }) => {
    apiServer.announcePatternChange({ event, path });
  });

  apiServer.listen();
}

module.exports = {
  serve,
};
