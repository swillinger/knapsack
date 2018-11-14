const webpack = require('webpack');
// const { relative, join } = require('path');
// const webpackDevServer = require('webpack-dev-server');
const createWebpackConfig = require('./create-webpack-config');
const log = require('./log');

/**
 * @param {BedrockConfig} config
 * @return {webpack.Compiler}
 */
function getWebpack(config) {
  const webpackConfig = createWebpackConfig({
    dist: config.dist,
    public: config.public,
  });
  return webpack(webpackConfig);
}

/**
 * @param {BedrockConfig} config
 * @return {Promise<any>}
 */
function build(config) {
  return new Promise((resolve, reject) => {
    const compiler = getWebpack(config);
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        log.error('Webpack Error!');
        console.log(err);
        console.log(
          stats.toString({
            chunks: false, // Makes the build much quieter
            colors: true, // Shows colors in the console
          }),
        );
        reject(err);
        return false;
      }
      log.success('Webpack done');
      resolve('Webpack done');
    });
  });
}

/**
 * @param {BedrockConfig} config
 * @return {Promise<any>}
 */
function watch(config) {
  return new Promise((resolve, reject) => {
    const compiler = getWebpack(config);
    compiler.watch({}, (err, stats) => {
      if (err || stats.hasErrors()) {
        log.error('Webpack Error!');
        console.log(err);
        console.log(
          stats.toString({
            chunks: false, // Makes the build much quieter
            colors: true, // Shows colors in the console
          }),
        );
        reject(err);
        return false;
      }
      console.log(
        stats.toString({
          chunks: false, // Makes the build much quieter
          colors: true, // Shows colors in the console
        }),
      );
      log.success('Webpack done watching');
      resolve('Webpack done watching');
    });
  });
}

module.exports = {
  build,
  watch,
};
