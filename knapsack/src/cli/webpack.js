/**
 *  Copyright (C) 2018 Basalt
    This file is part of Knapsack.
    Knapsack is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Knapsack is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Knapsack; if not, see <https://www.gnu.org/licenses>.
 */
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
    log.error('stats', info.errors.join('\n'), 'webpack');
    return false;
  }

  if (stats.hasWarnings()) {
    log.warn('stats', info.warnings.join('\n'), 'webpack');
  }
  return true;
}

/**
 * @param {KnapsackConfig} config
 * @return {webpack.Compiler}
 */
function getWebpack(config) {
  const webpackConfig = createWebpackConfig({
    dist: config.dist,
    public: config.public,
    useHtmlWebpackPlugin: true,
  });
  return webpack(webpackConfig);
}

/**
 * @param {KnapsackConfig} config
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
 * @param {KnapsackConfig} config
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
