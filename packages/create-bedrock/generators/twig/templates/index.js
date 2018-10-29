const { join } = require('path');
const BedrockSite = require('@basalt/bedrock-site');
const { version } = require('./package.json');

const urlBase =
  process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3088/';

const thisSite = new BedrockSite({
  dist: join(__dirname, 'dist'),
  public: join(__dirname, 'public'),
  // pluginSetupFile: join(__dirname, './bedrock.plugins.js'),
  // everything in `settings` MUST be JSON serializable
  settings: {
    isDebug: true,
    isDevMode: process.env.DEV_MODE === 'yes',
    isProd: process.env.NODE_ENV === 'production',
    hasJiraIssueCollector: false,
    websocketsPort: 5042,
    // patternIconBasePath: '/assets/images/pattern-thumbnails/',
    enablePatternIcons: false,
    enableBlockquotes: true,
    site: {
      title: 'Simple Site',
      subtitle: 'A Simple Example of a Design System',
      slogan: "Wasn't that simple?",
      version,
    },
    // parentBrand: {
    //   title: 'Basalt',
    //   logo: '/assets/images/logos/white-grey.svg',
    //   homepage: 'http://www.basalt.io',
    // },
    urls: {
      apiUrlBase: `${urlBase}api`,
      cssUrls: [`${urlBase}assets/simple.css`],
      // jsUrls: [`${urlBase}assets/crux.js`],
    },
  },
});

const { webpackConfig } = thisSite;

module.exports = {
  webpackConfig,
};
