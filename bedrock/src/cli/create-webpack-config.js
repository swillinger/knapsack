// const {
//   validateSchemaAndAssignDefaults,
// } = require('@basalt/bedrock-schema-utils');
const webpack = require('webpack');
// const Stylish = require('webpack-stylish');
const Visualizer = require('webpack-visualizer-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlTemplate = require('html-webpack-template');
const DashboardPlugin = require('webpack-dashboard/plugin');
const { resolve } = require('path');
// const bedrockSettingsSchema = require('../schemas/bedrock.config.schema.json');
const features = require('../lib/features');

const isProd = process.env.NODE_ENV === 'production';

/**
 * @typedef {Object} CreateWebpackConfig
 * @prop {string} dist - The absolute path to where files will be written.
 * @prop {string} [pluginSetupFile] - File that contains all the imported plugin register functions
 * @prop {string} public - The absolute path to where files will be available to the dev server.
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
      path: resolve(config.dist),
      publicPath: '/',
      chunkFilename: '[name].chunk.js',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|mjs)$/,
          loader: require.resolve('babel-loader'),
          // exclude: [/(node_modules)/],
          exclude: thePath => {
            if (thePath.includes('node_modules/@basalt')) {
              return false;
            }
            if (thePath.includes('node_modules')) {
              return true;
            }
            return false;
          },
          options: {
            extends: require.resolve('@basalt/bedrock-babel-config/es'),
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
      new Visualizer(), // view at output-dir/stats.html
      new DashboardPlugin(),
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
        links: [
          // code highlighting styles
          'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/darcula.min.css',
        ],
        scripts: [].filter(x => x),
        window: {
          //   bedrockSettings: config.settings,
          __BEDROCK__: {
            features,
          },
        },
      }),
    ],
    performance: {
      hints: isProd ? 'error' : false,
      maxAssetSize: 300000,
      maxEntrypointSize: 300000,
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
    devServer: {
      overlay: true,
      hot: true,
      contentBase: [resolve(config.dist), resolve(config.public)],
      historyApiFallback: {
        index: '/index.html',
      },
    },
  };
}

module.exports = createWebPackConfig;
