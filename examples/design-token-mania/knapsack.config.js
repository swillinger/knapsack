const HtmlRenderer = require('@basalt/knapsack-renderer-html');
const TwigRenderer = require('@basalt/knapsack-renderer-twig');
const { theoKnapsackFormat } = require('@basalt/knapsack');
const theo = require('theo');
const { version } = require('./package.json');

const format = theoKnapsackFormat(theo);

/** @type {KnapsackUserConfig} */
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
        namespaces: [
          {
            id: 'components',
            recursive: true,
            paths: ['./assets/patterns'],
          },
        ],
      },
    }),
  ],
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
};

module.exports = config;
