const { join } = require('path');
const createWebPackConfig = require('./src/cli/create-webpack-config');

module.exports = createWebPackConfig({
  dist: join(__dirname, './dist'),
  useHtmlWebpackPlugin: true,
});
