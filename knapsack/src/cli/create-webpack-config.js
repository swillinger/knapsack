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
// const {
//   validateSchemaAndAssignDefaults,
// } = require('@basalt/knapsack-schema-utils');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const Stylish = require('webpack-stylish');
// const Visualizer = require('webpack-visualizer-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { resolve } = require('path');
// const knapsackSettingsSchema = require('../schemas/knapsack.config.schema.json');
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
  //   knapsackConfigSchema,
  //   userConfig,
  // );
  // if (!results.ok) {
  //   console.error(results.message);
  //   console.error('knapsack config schema validation failed');
  //   process.exit(1);
  // }

  /** @type {CreateWebpackConfig} */
  const config = userConfig;
  // const config = results.data;

  /** @type {webpack.Configuration} */
  const webpackConfig = {
    entry: {
      main: [resolve(__dirname, '../client/'), config.pluginSetupFile].filter(
        x => x,
      ),
    },
    output: {
      filename: '[name].bundle.[hash].js',
      path: resolve(config.dist, 'knapsack'),
      publicPath: '/knapsack/',
      chunkFilename: '[name].chunk.[hash].js',
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
            extends: require.resolve('@basalt/knapsack-babel-config/es'),
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
          test: /\.scss?$/,
          exclude: /\.css?$/,
          use: [
            {
              loader: isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                sourceMap: true,
                // import: false,
                // url: false,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
                  postcssPresetEnv({
                    browsers: ['last 2 versions'],
                  }),
                ],
              },
            },
            {
              loader: 'resolve-url-loader',
              options: {
                debug: false,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                // includePaths: [],
                // scss data that will be available to ALL files
                // data: '',
                outputStyle: isProd ? 'compressed' : 'expanded',
                // Enables the line number and file where a selector is defined to be emitted into the compiled CSS as a comment. Useful for debugging, especially when using imports and mixins.
                sourceComments: false,
              },
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
      new WebappWebpackPlugin(
        resolve(__dirname, '../client/assets/favicon.png'),
      ),
      // https://github.com/jaketrent/html-webpack-template
      // template: https://github.com/jaketrent/html-webpack-template/blob/master/index.ejs
      new HtmlWebpackPlugin({
        // template: HtmlTemplate,
        inject: true,
        // title: config.settings.site.title,
        title: 'Knapsack',
        appMountId: 'app',
        cache: false,
        mobile: true,
        hash: true,
        filename: '../index.html',
        window: {
          //   knapsackSettings: config.settings,
          knapsack: {
            features,
          },
        },
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new OptimizeCssAssetsPlugin({
        // assetNameRegExp: /\.optimize\.css$/g,
        cssProcessor: cssnano,
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        canPrint: true,
      }),
    ],
    performance: {
      hints: isProd ? 'error' : false,
      maxAssetSize: 610000,
      maxEntrypointSize: 610000,
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
      namedModules: true,
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
