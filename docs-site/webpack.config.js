const { join } = require('path');
const createWebPackConfig = require('@basalt/knapsack/src/cli/create-webpack-config');

const dist = join(__dirname, './static/dist');

const baseConfig = createWebPackConfig({
  dist,
  useHtmlWebpackPlugin: false,
  injectCssChanges: false,
});

const config = {
  ...baseConfig,
  entry: {
    main: './src',
  },
  output: {
    filename: '[name].bundle.js',
    path: dist,
    publicPath: '/dist/',
    chunkFilename: '[name].chunk.js',
  },
};

module.exports = config;
