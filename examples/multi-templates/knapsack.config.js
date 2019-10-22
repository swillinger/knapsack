const HtmlRenderer = require('@knapsack/renderer-html');
const TwigRenderer = require('@knapsack/renderer-twig');
const { KnapsackReactRenderer } = require('@knapsack/renderer-react');
const { theoKnapsackFormat } = require('@basalt/knapsack');
const theo = require('theo');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const { version } = require('./package.json');

const format = theoKnapsackFormat(theo);

/** @type {KnapsackUserConfig} */
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
    new KnapsackReactRenderer({
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
