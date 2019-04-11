const HtmlRenderer = require('@knapsack/renderer-html');
const TwigRenderer = require('@knapsack/renderer-twig');
const { theoKnapsackFormat } = require('@basalt/knapsack');
// const theo = require('theo');
const designTokens = require('./assets/design-tokens/dist/knapsack-design-tokens');
const { version } = require('./package.json');

// const format = theoKnapsackFormat(theo);

/** @type {KnapsackUserConfig} */
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
  // not setting here since we declare it on each template
  assetSets: [],
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
