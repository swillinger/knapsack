const webpack = require('webpack');
// const { relative, join } = require('path');
// const webpackDevServer = require('webpack-dev-server');
const createWebpackConfig = require('./create-webpack-config');
const log = require('./log');

/**
 * Handle Webpack Results
 * @param {Error} err
 * @param {webpack.Stats} stats
 * @return {boolean}
 */
function handleWebpackResults(err, stats) {
  if (err) {
    log.error('', err.stack || err, 'webpack');
    // @todo consider keeping this; was on WebPack docs, but TypeScript doesn't think `.details` exists on `err`
    // if (err.details) {
    //   log.error('', err.details, 'webpack');
    // }
    return false;
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    log.error('stats', info.errors, 'webpack');
    return false;
  }

  if (stats.hasWarnings()) {
    log.warn('stats', info.warnings, 'webpack');
  }
  return true;
}

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
    log.info('build starting...', null, 'webpack');
    compiler.run((err, stats) => {
      const ok = handleWebpackResults(err, stats);
      if (ok) {
        log.info('build done', null, 'webpack');
        resolve();
      } else {
        reject();
      }
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
    log.info('watch starting...', null, 'webpack');
    compiler.watch({}, (err, stats) => {
      const ok = handleWebpackResults(err, stats);
      if (ok) {
        log.info('rebuilt', null, 'webpack');
        resolve();
      } else {
        reject();
      }
    });
  });
}

module.exports = {
  build,
  watch,
};
