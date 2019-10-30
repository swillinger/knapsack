const { join } = require('path');
const { createWebPackConfig } = require('@knapsack/build-tools');

const baseConfig = createWebPackConfig({
  mainEntries: ['./src'],
  extraSrcDirs: [__dirname, join(__dirname, '../knapsack/src')],
  dist: join(__dirname, './static/dist'),
  injectCssChanges: false,
});

module.exports = baseConfig;
