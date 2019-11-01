const { join } = require('path');
const { createWebPackConfig } = require('@knapsack/build-tools');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const features = require('./dist/lib/features');

module.exports = createWebPackConfig({
  mainEntries: join(__dirname, './src/client/'),
  extraSrcDirs: [join(__dirname, './src')],
  dist: join(__dirname, './dist/client'),
  useHtmlWebpackPlugin: true,
  extraPlugins: [
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
      filename: 'index.html',
      window: {
        //   knapsackSettings: config.settings,
        knapsack: {
          features, // @todo debug why this isn't in `window.knapsack.features`
        },
      },
    }),
    new WebappWebpackPlugin(join(__dirname, './src/client/assets/favicon.png')),
  ],
});
