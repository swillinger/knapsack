const { resolve } = require('path');
const babelConfig = require('./.babelrc.json');
// const ReactRenderer = require('@basalt/bedrock-renderer-react/src/entry');

/** @type {webpack.Configuration} */
const config = {
  entry: {},
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    path: resolve(__dirname, './public/build'),
    publicPath: '/build/',
    chunkFilename: '[name].chunk.js',
    library: 'bedrock',
    libraryTarget: 'var',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        options: babelConfig,
      }
    ]
  },
  resolve: {
    extensions: ['.jsx', '.js', '.json'],
  }
};

module.exports = config;
