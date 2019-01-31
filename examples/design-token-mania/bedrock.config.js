const HtmlRenderer = require('@basalt/bedrock-renderer-html');
const TwigRenderer = require('@basalt/bedrock-renderer-twig');
const { version } = require('./package.json');

/** @type {BedrockConfig} */
const config = {
  patterns: ['./assets/patterns/*'],
  newPatternDir: './assets/patterns/',
  dist: './dist',
  public: './public',
  data: './data',
  css: ['./public/assets/simple.css'],
  // js: ['./public/assets/script.js'],
  changelog: './CHANGELOG.md',
  version,
  templateRenderers: [
    new HtmlRenderer(),
    new TwigRenderer({
      src: {
        roots: ['./assets/patterns'],
        namespaces: [{
          id: 'components',
          recursive: true,
          paths: ['./assets/patterns'],
        }],
      }
    }),
  ],
  designTokens: './design-tokens/tokens.yml',
};

module.exports = config;
