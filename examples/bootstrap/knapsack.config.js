const { join } = require('path');
const HtmlRenderer = require('@knapsack/renderer-html');
const TwigRenderer = require('@knapsack/renderer-twig');
const designTokens = require('./assets/design-tokens/dist/knapsack-design-tokens');
const { version } = require('./package.json');

/** @type {import('../../knapsack/src/schemas/knapsack-config.ts').KnapsackConfig} */
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
  cloud: {
    repoOwner: 'basaltinc',
    repoName: 'knapsack',
    repoRoot: join(__dirname, '../..'),
    baseBranch: getGitBranch(),
    apiBase: 'https://d4kez41c5b.execute-api.us-west-2.amazonaws.com/Prod',
    // apiBase: 'http://127.0.0.1:3000',
  },
};

module.exports = config;
