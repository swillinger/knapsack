const { join } = require('path');
const { createWebPackConfig } = require('@knapsack/build-tools');

const knapsackWebpackConfig = createWebPackConfig({
  // Not really needed since it's used only for `entry` and `output`, and we throw those away...
  dist: join(__dirname, './fake-dist'),
  // injectCssChanges: false,
  extraSrcDirs: [
    __dirname,
    // join(__dirname, '../../../components'),
    join(__dirname, '../src'),
    join(__dirname, '../../knapsack/src/client'),
  ],
  maxAssetSize: 2600 * 1000, // wow, this is getting BIG!
  tsConfigFile: join(__dirname, '../tsconfig.json'),
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
