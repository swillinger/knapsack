#! /usr/bin/env node
const program = require('commander');
const { existsSync } = require('fs-extra');
const { join, resolve, dirname } = require('path');
const log = require('./log');
const { serve } = require('../server/server');
const { version } = require('../../package.json');
const webpack = require('./webpack');
const { getTokens, processTokens } = require('./design-tokens');

/**
 * Prepare user config: validate, convert all paths to absolute, assign defaults
 * @param {BedrockConfig} userConfig
 * @param {string} from
 * @returns {BedrockConfig}
 * @todo validate with schema and assign defaults
 * @todo ensure path exists
 * @todo convert all paths to absolute (in-progress)
 */
function processConfig(userConfig, from) {
  const {
    src,
    public: publicDir,
    dist,
    examplesDir,
    designTokens,
    css,
    ...rest
  } = userConfig;
  return {
    src: src.map(s => resolve(from, s)),
    designTokens: resolve(from, designTokens),
    public: resolve(from, publicDir),
    examplesDir: resolve(from, examplesDir),
    css: css.map(x => resolve(from, x)),
    dist: resolve(from, dist),
    ...rest,
  };
}

const configPath = join(process.cwd(), 'bedrock.config.js');
if (!existsSync(configPath)) {
  log.error('Could not find bedrock.config.js file in CWD.');
  process.exit(1);
}

/** @type {BedrockConfig} */
const config = processConfig(require(configPath), dirname(configPath));
// console.log({ config });
program.version(version);

program.command('serve').action(async () => {
  log.info('running serve...');
  const tokens = await processTokens(config.designTokens);
  await serve(config, {
    tokens,
  });
});

program.command('build').action(async () => {
  log.info('running build...');
  try {
    await webpack.build(config);
  } catch (e) {
    log.error('bedrock build error!');
    console.log(e);
    process.exit(1);
  }
});

program.command('start').action(async () => {
  log.info('running start...');
  try {
    await webpack.watch(config);
  } catch (e) {
    log.error('bedrock start error!');
    console.log(e);
    process.exit(1);
  }
});

program.parse(process.argv);
