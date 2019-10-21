const { join } = require('path');
const { createWebPackConfig } = require('./create-webpack-config');

module.exports = createWebPackConfig({
  dist: join(__dirname, './dist/client'),
  useHtmlWebpackPlugin: true,
});
