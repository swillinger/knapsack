const HtmlRenderer = require('@basalt/bedrock-renderer-html');
const TwigRenderer = require('@basalt/bedrock-renderer-twig');
const { theoBedrockFormat } = require('@basalt/bedrock');
// const theo = require('theo');
const designTokens = require('./assets/design-tokens/dist/bedrock-design-tokens');
const { version } = require('./package.json');

// const format = theoBedrockFormat(theo);

/** @type {BedrockUserConfig} */
const config = {
  // patterns: ['./assets/patterns/*', './assets/pages/*'], @todo create full page examples
  patterns: ['./assets/patterns/*'],
  newPatternDir: './assets/patterns/',
  designTokens: {
    createCodeSnippet: token => `$${token.name}`,
    data: designTokens,
  },
  dist: './dist',
  public: './public',
  data: './data',
  css: ['./public/css/bootstrap.css'],
  js: ['./public/js/bootstrap.bundle.js'],
  version,
  templateRenderers: [
    new HtmlRenderer(),
    new TwigRenderer({
      src: {
        roots: ['./assets/patterns'],
        namespaces: [
          {
            id: 'components',
            recursive: true,
            paths: ['./assets/patterns'],
          },
          {
            id: 'pages',
            recursive: true,
            paths: ['./assets/pages'],
          },
        ],
      }
    }),
  ],
};

module.exports = config;
