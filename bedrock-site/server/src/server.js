const BedrockApiServer = require('./bedrock-api-server');
const BedrockPatternManifest = require('./pattern-manifest/bedrock-pattern-manifest');

function serve() {
  const patternManifest = new BedrockPatternManifest({});

  const apiServer = new BedrockApiServer({});

  patternManifest.watch(({ event, path }) => {
    apiServer.announcePatternChange({ event, path });
  });

  apiServer.listen();
}

module.exports = {
  serve,
};
