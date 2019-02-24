const { isAbsolute, dirname, resolve } = require('path');
const { fileExistsOrExit } = require('../server/server-utils');
const { processConfig } = require('./config');
const { Patterns } = require('../server/patterns');
const log = require('../cli/log');
const { PageBuilder } = require('../server/page-builder');
const { Settings } = require('../server/settings');
const { CustomPages } = require('../server/custom-pages');
const { DesignTokens } = require('../server/design-tokens');
const { Docs } = require('../server/docs');

let isReady = false;

/**
 * @typedef {Object} BedrockBrain
 * @prop {Patterns} patterns
 * @prop {Settings} settings
 * @prop {PageBuilder} pageBuilderPages
 * @prop {CustomPages} customPages
 * @prop {DesignTokens} tokens
 * @prop {Docs} docs
 * @prop {BedrockConfig} config
 */

let brain = {
  patterns: null,
  settings: null,
  pageBuilderPages: null,
  customPages: null,
  tokens: null,
  docs: null,
  config: null,
};

/**
 * Take config and then start up the whole system!
 * @param {BedrockConfig} config
 * @param {string} [configPathBase=process.cwd()] - path that config file paths are relative from
 * @return {BedrockBrain}
 */
function bootstrap(config, configPathBase = process.cwd()) {
  const patterns = new Patterns({
    newPatternDir: config.newPatternDir,
    patternPaths: config.patterns,
    dataDir: config.data,
    templateRenderers: config.templateRenderers,
    assetSets: config.assetSets,
    publicDir: config.public,
    configPathBase,
  });

  config.templateRenderers.forEach(templateRenderer => {
    if (templateRenderer.init) {
      templateRenderer.init({
        config,
        allPatterns: patterns.getPatterns(),
        templatePaths: patterns
          .getAllTemplatePaths()
          .filter(t => templateRenderer.test(t)),
      });
      log.info('Init done', null, `templateRenderer:${templateRenderer.id}`);
    }
  });
  log.verbose('All templateRenderers init done');

  const settings = new Settings({ dataDir: config.data });
  const pageBuilderPages = new PageBuilder({ dataDir: config.data });
  const customPages = new CustomPages({ dataDir: config.data });
  const tokens = new DesignTokens(config.designTokens);
  const docs = new Docs({ docsDir: config.docsDir });

  brain = {
    patterns,
    settings,
    pageBuilderPages,
    customPages,
    tokens,
    docs,
    config,
  };

  isReady = true;

  return brain;
}

/**
 * Take config file path and then start up the whole system!
 * @param {string} configPath - path to `bedrock.config.js`
 * @return {BedrockBrain}
 */
function bootstrapFromConfigFile(configPath) {
  const absoluteConfigPath = isAbsolute(configPath)
    ? configPath
    : resolve(configPath);
  fileExistsOrExit(absoluteConfigPath);
  const userConfig = require(absoluteConfigPath); // eslint-disable-line global-require
  const configPathBase = dirname(absoluteConfigPath);
  const config = processConfig(userConfig, configPathBase);
  return bootstrap(config, configPathBase);
}

/**
 * Get the Brain created from a previous bootstrap
 * @return {BedrockBrain}
 */
function getBrain() {
  if (!isReady) {
    log.error(
      'Not ready yet! You cannot "getBrain()" before "bootstrap()" or "bootstrapFromConfigFile()" has been run',
    );
    process.exit(1);
  }
  return brain;
}

module.exports = {
  bootstrap,
  bootstrapFromConfigFile,
  getBrain,
};
