const HtmlRenderer = require('@knapsack/renderer-html');
const TwigRenderer = require('@knapsack/renderer-twig');
const designTokens = require('./assets/design-tokens/dist/knapsack-design-tokens');
const { version } = require('./package.json');

/** @type {import('@knapsack/app/src/schemas/knapsack-config').KnapsackUserConfig} */
const config = {
  designTokens: {
    createCodeSnippet: token => `$${token.name}`,
    data: designTokens,
  },
  dist: './dist',
  public: './public',
  data: './data',
  version,
  changelog: './CHANGELOG.md',
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
