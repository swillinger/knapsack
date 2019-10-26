const { join } = require('path');
const {
  createWebPackConfig,
} = require('@basalt/knapsack/create-webpack-config');

const knapsackWebpackConfig = createWebPackConfig({
  // Not really needed since it's used only for `entry` and `output`, and we throw those away...
  dist: join(__dirname, './fake-dist'),
  useHtmlWebpackPlugin: false,
  // injectCssChanges: false,
  extraSrcDirs: [
    join(__dirname, '../../../components'),
    join(__dirname, '../../../knapsack/src/client'),
  ],
  maxAssetSize: 1300 * 1000,
});

/**
 * Alter Storybook's WebPack Config
 * @param {object} opt
 * @param {import("webpack").Configuration} opt.config
 * @param {string} opt.mode - has a value of 'DEVELOPMENT' or 'PRODUCTION' (used when building the static version of storybook)
 * @return {Promise<import("webpack").Configuration>}
 * @link https://storybook.js.org/docs/configurations/custom-webpack-config/
 */
async function alterWebpackConfig({ config }) {
  const { entry, output, plugins } = config;

  return {
    ...knapsackWebpackConfig,
    entry,
    output,
    plugins: [...knapsackWebpackConfig.plugins, ...plugins],
  };
}

// Export a function. Accept the base config as the only param.
module.exports = alterWebpackConfig;
