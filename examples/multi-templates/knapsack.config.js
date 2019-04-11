const HtmlRenderer = require('@basalt/bedrock-renderer-html');
const TwigRenderer = require('@basalt/bedrock-renderer-twig');
const ReactRenderer = require('@basalt/bedrock-renderer-react');
const { theoBedrockFormat } = require('@basalt/bedrock');
const theo = require('theo');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const { version } = require('./package.json');

const format = theoBedrockFormat(theo);

/** @type {BedrockUserConfig} */
const config = {
  patterns: [ './assets/patterns/*' ],
  newPatternDir: './assets/patterns/',
  designTokens: {
    createCodeSnippet: token => `$${token.name}`,
    data: theo.convertSync({
      transform: {
        type: 'web',
        file: './design-tokens/tokens.yml',
      },
      format,
    }),
  },
  dist: './dist',
  public: './public',
  data: './data',
  css: [ './public/assets/simple.css' ],
  // js: ['./public/assets/script.js'],
  changelog: './CHANGELOG.md',
  version,
  docsDir: './docs',
  templateRenderers: [
    new ReactRenderer({
      webpackConfig,
      webpack,
    }),
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
};

module.exports = config;
