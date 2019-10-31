import { isAbsolute, dirname, resolve } from 'path';
import { fileExistsOrExit } from '../server/server-utils';
import { processConfig } from './config';
import * as log from '../cli/log';
import { Patterns } from '../server/patterns';
import { PageBuilder } from '../server/page-builder';
import { Settings } from '../server/settings';
import { CustomPages } from '../server/custom-pages';
import { DesignTokens } from '../server/design-tokens';
import { Docs } from '../server/docs';
import { KnapsackBrain, KnapsackConfig } from '../schemas/main-types';

let isReady = false;

let brain: KnapsackBrain = {
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
 */
export function bootstrap(
  config: KnapsackConfig,
  /**
   * path that config file paths are relative from
   */
  configPathBase: string = process.cwd(),
): KnapsackBrain {
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
 */
export function bootstrapFromConfigFile(
  /**
   * path to `knapsack.config.js`
   */
  configPath: string,
): KnapsackBrain {
  const absoluteConfigPath = isAbsolute(configPath)
    ? configPath
    : resolve(configPath);
  fileExistsOrExit(absoluteConfigPath);
  const userConfig = require(absoluteConfigPath); // eslint-disable-line
  const configPathBase = dirname(absoluteConfigPath);
  const config = processConfig(userConfig, configPathBase);
  return bootstrap(config, configPathBase);
}

/**
 * Get the Brain created from a previous bootstrap
 */
export function getBrain(): KnapsackBrain {
  if (!isReady) {
    log.error(
      'Not ready yet! You cannot "getBrain()" before "bootstrap()" or "bootstrapFromConfigFile()" has been run',
    );
    process.exit(1);
  }
  return brain;
}
