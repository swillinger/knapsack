const { join } = require('path');
const HtmlRenderer = require('@knapsack/renderer-html');
const TwigRenderer = require('@knapsack/renderer-twig');
const {
  KnapsackWebComponentRenderer,
} = require('@knapsack/renderer-web-components');
const { KnapsackReactRenderer } = require('@knapsack/renderer-react');
const webpack = require('webpack');
const babelConfig = require('@knapsack/babel-config/es');
const {
  configure: configureChangelogMd,
} = require('@knapsack/plugin-changelog-md');
const webpackConfig = require('./webpack.config');
const { getGitBranch } = require('@knapsack/app/dist/server/server-utils');
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
  templateRenderers: [
    new KnapsackReactRenderer({
      webpackConfig,
      webpack,
      babelConfig,
      demoWrapperPath: join(__dirname, './demo-wrapper.jsx'),
    }),
    new KnapsackWebComponentRenderer(),
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
      },
    }),
    new HtmlRenderer(),
  ],
  plugins: [
    configureChangelogMd({
      changelogPath: './CHANGELOG.md',
    }),
  ],
  cloud: {
    repoOwner: 'basaltinc',
    repoName: 'knapsack',
    repoRoot: join(__dirname, '../..'),
    baseBranch: getGitBranch() || 'develop',
    apiBase: 'https://d4kez41c5b.execute-api.us-west-2.amazonaws.com/Prod',
    // apiBase: 'http://127.0.0.1:3000',
  },
};

module.exports = config;
