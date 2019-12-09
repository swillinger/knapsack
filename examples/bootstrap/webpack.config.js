const { createWebPackConfig } = require('@knapsack/build-tools');
const { join } = require('path');

const config = createWebPackConfig({
  mainEntries: join(__dirname, './assets/'),
  extraSrcDirs: [
    join(__dirname, './assets'),
  ],
  dist: join(__dirname, './public/dist'),
  webRootDir: join(__dirname, './public'),
  useHtmlWebpackPlugin: false,
  outputFilename: 'main.js',
});


module.exports = {
  ...config,
  mode: 'development',
  optimization: {},
};
