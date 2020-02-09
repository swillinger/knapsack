const { KnapsackReactRenderer } = require('@knapsack/renderer-react');
const { join } = require('path');
const webpack = require('webpack');
const { createWebPackConfig } = require('@knapsack/build-tools');
const babelConfig = require('@knapsack/babel-config/es');
const { version } = require('./package.json');

const webpackConfig = createWebPackConfig({
  // Not really needed since it's used only for `entry` and `output`, and we throw those away...
  dist: join(__dirname, './public/dist'),
  webRootDir: './public',
  // injectCssChanges: false,
  extraSrcDirs: [
    __dirname,
    // join(__dirname, '../../../components'),
    join(__dirname, '../src'),
    // join(__dirname, '../../knapsack/src'),
  ],
  tsConfigFile: join(__dirname, '../tsconfig.json'),
  useHtmlWebpackPlugin: false,
});

/** @type {import('../../knapsack/src/schemas/knapsack-config.ts').KnapsackConfig} */
const config = {
  designTokens: {
    data: {
      tokens: [],
    },
  },
  dist: './public/dist',
  public: './public',
  data: './data',
  version,
  templateRenderers: [
    new KnapsackReactRenderer({
      webpackConfig,
      webpack,
      babelConfig,
      demoWrapperPath: join(__dirname, './demo-wrapper.tsx'),
    }),
    // new HtmlRenderer(),
  ],
  cloud: {
    repoOwner: 'basaltinc',
    repoName: 'knapsack',
    repoRoot: join(__dirname, '../..'),
    // baseBranch: getGitBranch(),
    apiBase: 'https://d4kez41c5b.execute-api.us-west-2.amazonaws.com/Prod',
    // apiBase: 'http://127.0.0.1:3000',
  },
};

module.exports = config;
