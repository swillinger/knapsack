import { isAbsolute, dirname, resolve } from 'path';
import { fileExistsOrExit } from '../server/server-utils';
import { processConfig } from './config';
import * as log from '../cli/log';
import { Patterns } from '../server/patterns';
import { PageBuilder } from '../server/page-builder';
import { Settings } from '../server/settings';
import { Navs } from '../server/navs';
import { CustomPages } from '../server/custom-pages';
import { DesignTokens } from '../server/design-tokens';
import { AssetSets } from '../server/asset-sets';
import { KnapsackBrain, KnapsackConfig } from '../schemas/main-types';

let isReady = false;

let brain: KnapsackBrain = {
  patterns: null,
  settings: null,
  pageBuilderPages: null,
  customPages: null,
  tokens: null,
  assetSets: null,
  navs: null,
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
  const assetSets = new AssetSets({
    dataDir: config.data,
    publicDir: config.public,
  });

  const patterns = new Patterns({
    assetSets,
    dataDir: config.data,
    templateRenderers: config.templateRenderers,
  });

  const settings = new Settings({
    dataDir: config.data,
    publicDir: config.public,
  });
  // const pageBuilderPages = new PageBuilder({ dataDir: config.data });
  const customPages = new CustomPages({ dataDir: config.data });
  const navs = new Navs({ dataDir: config.data });
  const tokens = new DesignTokens(config.designTokens);

  brain = {
    patterns,
    settings,
    // pageBuilderPages,
    customPages,
    tokens,
    navs,
    assetSets,
    config,
  };

  log.verbose('Brain built');

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
