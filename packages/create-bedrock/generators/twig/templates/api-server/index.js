const { join } = require('path');
const BedrockPatternManifest = require('@basalt/bedrock-pattern-manifest');
const BedrockApiServer = require('@basalt/bedrock-api-server');
const {
  paths,
  twigRenderer,
  setExample,
  getExamples,
  getExample,
  designTokens,
} = require('../assets');

const port = 3088;

const patternManifest = new BedrockPatternManifest({
  patternPaths: paths.patterns,
  newPatternDir: paths.newPatternDir,
});

const apiServer = new BedrockApiServer({
  port,
  websocketsPort: 5042,
  spaIndexHtmlPath: join(__dirname, '../dist/index.html'),
  baseUrl: '/api',
  showEndpoints: true,
  twigRenderer,
  patterns: {
    getPattern: patternManifest.getPattern,
    getPatterns: patternManifest.getPatterns,
    setPatternMeta: patternManifest.setPatternMeta,
    getPatternMeta: patternManifest.getPatternMeta,
    createPatternFiles: patternManifest.createPatternFiles,
  },
  designTokens,
  examples: { getExample, getExamples, setExample },
  // sections: [],
  staticDirs: [
    {
      prefix: '/assets',
      path: paths.assetDir,
    },
  ],
});

patternManifest.watch(({ event, path }) => {
  apiServer.announcePatternChange({ event, path });
});

apiServer.listen();
