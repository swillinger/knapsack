/**
 *  Copyright (C) 2018 Basalt
    This file is part of Bedrock.
    Bedrock is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Bedrock is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Bedrock; if not, see <https://www.gnu.org/licenses>.
 */
// const {
//   validateSchemaAndAssignDefaults,
// } = require('@basalt/bedrock-schema-utils');
const webpack = require('webpack');
// const Stylish = require('webpack-stylish');
// const Visualizer = require('webpack-visualizer-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlTemplate = require('html-webpack-template');
const DashboardPlugin = require('webpack-dashboard/plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const { resolve } = require('path');
// const bedrockSettingsSchema = require('../schemas/bedrock.config.schema.json');
const features = require('../lib/features');

const isProd = process.env.NODE_ENV === 'production';

/**
 * @typedef {Object} CreateWebpackConfig
 * @prop {string} dist - The absolute path to where files will be written.
 * @prop {string} [pluginSetupFile] - File that contains all the imported plugin register functions
 * @prop {string} [public] - The absolute path to where files will be available to the dev server.
 */

/**
 * @private
 * @param {CreateWebpackConfig} userConfig - @todo document
 * @return {Object} - WebPack config
 */
function createWebPackConfig(userConfig) {
  // @todo re-enable schema validation - this config comes from users
  // const results = validateSchemaAndAssignDefaults(
  //   bedrockConfigSchema,
  //   userConfig,
  // );
  // if (!results.ok) {
  //   console.error(results.message);
  //   console.error('bedrock config schema validation failed');
  //   process.exit(1);
  // }

  /** @type {CreateWebpackConfig} */
  const config = userConfig;
  // const config = results.data;

  /** @type {webpack.Configuration} */
  const webpackConfig = {
    entry: {
      main: [
        resolve(__dirname, '../client/'),
        resolve(__dirname, '../client/design-tokens-setup'),
        config.pluginSetupFile,
      ].filter(x => x),
    },
    output: {
      filename: '[name].bundle.js',
      path: resolve(config.dist, 'bedrock'),
      publicPath: '/bedrock/',
      chunkFilename: '[name].chunk.js',
    },
    module: {
      rules: [
        {
          // https://github.com/graphql/graphiql/issues/617
          test: /\.flow$/,
          loader: require.resolve('ignore-loader'),
        },
        {
          test: /\.(js|jsx|mjs)$/,
          loader: require.resolve('babel-loader'),
          include: [resolve(__dirname, '../../src')],
          exclude: [/(node_modules)/],
          options: {
            extends: require.resolve('@basalt/bedrock-babel-config/es'),
            cacheDirectory: true,
          },
        },
        {
          test: [/\.jpeg?$/, /\.jpg?$/, /\.svg?$/, /\.png?$/],
          loader: require.resolve('url-loader'),
        },
        {
          test: [/\.css?$/],
          use: [
            {
              loader: require.resolve('style-loader'),
            },
            {
              loader: require.resolve('css-loader'),
            },
          ],
        },
        {
          test: /\.(woff(2)?|ttf|eot)?$/,
          use: [
            {
              loader: require.resolve('file-loader'),
              options: {
                name: '[name].[ext]',
                outputPath: 'fonts/',
              },
            },
          ],
        },
      ],
    },
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',
    resolve: {
      // symlinks: false, // @todo consider, but be careful
      extensions: ['.mjs', '.jsx', '.js', '.json', '.css'],
      mainFields: ['module', 'main'],
      modules: ['node_modules', resolve(__dirname, 'node_modules')],
      alias: {
        'styled-components': require.resolve('styled-components'),
      },
    },
    // stats: 'none',
    plugins: [
      // new Stylish(), @todo consider re-enabling later, needed to for debugging
      new webpack.NamedModulesPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          DEV_MODE: JSON.stringify(process.env.DEV_MODE),
        },
      }),
      // new Visualizer(), // view at output-dir/stats.html
      new DashboardPlugin(),
      new FaviconsWebpackPlugin(
        resolve(__dirname, '../client/assets/favicon.png'),
      ),
      // https://github.com/jaketrent/html-webpack-template
      // template: https://github.com/jaketrent/html-webpack-template/blob/master/index.ejs
      new HtmlWebpackPlugin({
        template: HtmlTemplate,
        inject: false,
        // title: config.settings.site.title,
        title: 'Bedrock',
        appMountId: 'app',
        cache: false,
        mobile: true,
        filename: '../index.html',
        links: [
          // code highlighting styles
          'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/darcula.min.css',
        ],
        scripts: [].filter(x => x),
        window: {
          //   bedrockSettings: config.settings,
          bedrock: {
            features,
          },
        },
      }),
    ],
    performance: {
      hints: isProd ? 'error' : false,
      maxAssetSize: 510000,
      maxEntrypointSize: 510000,
      // if this function returns false it is not included in performance calculation
      assetFilter: assetFilename => {
        if (assetFilename.includes('graphiql')) {
          return false;
        }
        if (/\.map$/.test(assetFilename)) {
          return false;
        }
        return true;
      },
    },
    optimization: {
      minimize: isProd,
      // minimizer: [new TerserPlugin()],
      namedChunks: true,
      runtimeChunk: 'single',
      // https://itnext.io/react-router-and-webpack-v4-code-splitting-using-splitchunksplugin-f0a48f110312
      // https://webpack.js.org/plugins/split-chunks-plugin/
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 30,
        maxAsyncRequests: 50,
        maxSize: 300000,
      },
    },
  };

  if (isProd) {
    webpackConfig.mode = 'production';
    webpackConfig.optimization = {
      minimizer: [
        new TerserPlugin({
          parallel: true,
          sourceMap: true,
          terserOptions: {
            // ecma: 6,
            // warnings: true,
            module: true,
          },
        }),
      ],
    };
  } else {
    webpackConfig.mode = 'development';
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return {
    ...webpackConfig,
    // devServer: {
    //   overlay: true,
    //   hot: true,
    //   contentBase: [resolve(config.dist), resolve(config.public)],
    //   historyApiFallback: {
    //     index: '/index.html',
    //   },
    // },
  };
}

module.exports = createWebPackConfig;
