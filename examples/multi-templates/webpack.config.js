const { resolve } = require('path');
const babelConfig = require('./.babelrc.json');

/** @type {webpack.Configuration} */
const config = {
  entry: {},
  mode: 'development',
  output: {},
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
