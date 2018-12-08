#! /usr/bin/env node
const program = require('commander');
const { existsSync, copy, ensureSymlink, remove } = require('fs-extra');
const portfinder = require('portfinder');
const { join, resolve, dirname, relative } = require('path');
const log = require('./log');
const { serve } = require('../server/server');
const { version } = require('../../package.json');
const { dirExistsOrExit, fileExistsOrExit } = require('../server/server-utils');
// const webpack = require('./webpack');

// If any of our parent directories are not `node_modules`, then we are in "dev mode", which basically means that we are Bedrock developers working on this package in the monorepo.
const isDevMode = !dirname(__dirname)
  .split('/')
  .includes('node_modules');

if (isDevMode) log.info('Bedrock Dev Mode on');

/**
 * Prepare user config: validate, convert all paths to absolute, assign defaults
 * @param {BedrockConfig} userConfig
 * @param {string} from
 * @returns {BedrockConfig}
 * @todo validate with schema and assign defaults
 */
function processConfig(userConfig, from) {
  const {
    patterns,
    public: publicDir,
    dist,
    designTokens,
    css,
    js,
    docsDir,
    ...rest
  } = userConfig;
  const config = {
    patterns: patterns.map(p => resolve(from, p)),
    designTokens: resolve(from, designTokens),
    public: resolve(from, publicDir),
    css: css ? css.map(x => (x.startsWith('http') ? x : resolve(from, x))) : [],
    js: js ? js.map(x => (x.startsWith('http') ? x : resolve(from, x))) : [],
    dist: resolve(from, dist),
    docsDir: docsDir ? resolve(from, docsDir) : null,
    ...rest,
  };

  // @todo check if `config.patterns` exists; but can't now as it can contain globs
  fileExistsOrExit(config.designTokens);
  dirExistsOrExit(config.public);
  if (config.docsDir) dirExistsOrExit(config.docsDir);
  if (config.css) config.css.forEach(c => fileExistsOrExit(c));
  if (config.js) config.js.forEach(j => fileExistsOrExit(j));

  // checking to make sure all CSS and JS paths are inside the `config.public` directory
  [config.js, config.css].forEach(assets => {
    const assetsNotPublicallyReachable = assets
      .filter(asset => !asset.startsWith('http'))
      .map(asset => relative(config.public, asset))
      .filter(asset => asset.includes('..')).length;
    if (assetsNotPublicallyReachable > 0) {
      log.error(
        `Some CSS or JS is not publically accessible! These must be either remote or places inside the "public" dir (${publicDir})`,
      );
      process.exit(1);
    }
  });

  return config;
}

/**
 * @return {Promise<BedrockMeta>}
 */
async function getMeta() {
  return {
    websocketsPort: await portfinder.getPortPromise(),
    bedrockVersion: version,
  };
}

/**
 * @param {BedrockConfig} config
 * @return {Promise<void>}
 */
async function build(config) {
  try {
    if (isDevMode) {
      // we symlink in devmode
      await remove(config.dist);
      await ensureSymlink(join(__dirname, '../../dist/'), config.dist);
    } else {
      await copy(join(__dirname, '../../dist/'), config.dist, {
        overwrite: true,
      });
    }
    log.info('built', null, 'build');
  } catch (e) {
    log.error('bedrock build error!');
    console.log(e);
    process.exit(1);
  }
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

// const userPkgPath = join(process.cwd(), 'package.json');
// let userPkg = {};
// if (existsSync(userPkgPath)) userPkg = require(userPkgPath); // eslint-disable-line
// const { scripts } = userPkg;

program.command('serve').action(async () => {
  await serve(config, await getMeta());
});

program.command('build').action(async () => {
  await build(config);
});

program.command('start').action(async () => {
  await build(config);
  await serve(config, await getMeta());
});

program.parse(process.argv);
