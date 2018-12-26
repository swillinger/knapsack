const HtmlRenderer = require('@basalt/bedrock-renderer-html');
const TwigRenderer = require('@basalt/bedrock-renderer-twig');
const ReactRenderer = require('@basalt/bedrock-renderer-react');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

/** @type {BedrockUserConfig} */
const config = {
  patterns: [ './assets/patterns/*' ],
  newPatternDir: './assets/patterns/',
  designTokens: './design-tokens/tokens.yml',
  dist: './dist',
  public: './public',
  data: './data',
  css: [ './public/assets/simple.css' ],
  // js: ['./public/assets/script.js'],
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
