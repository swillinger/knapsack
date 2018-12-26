#! /usr/bin/env node
/**
 *  Copyright (C) 2018 Basalt
    This file is part of Bedrock.
    Bedrock is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Bedrock is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Bedrock; if not, see <https://www.gnu.org/licenses>.
 */
const program = require('commander');
const { existsSync, copy, emptyDir } = require('fs-extra');
const portfinder = require('portfinder');
const { join, resolve, dirname, relative } = require('path');
const { validateUniqueIdsInArray } = require('@basalt/bedrock-schema-utils');
const log = require('./log');
const { bedrockEvents, EVENTS } = require('../server/events');
const { Patterns } = require('../server/patterns');
const { serve } = require('../server/server');
const { version } = require('../../package.json');
const { dirExistsOrExit, fileExistsOrExit } = require('../server/server-utils');
// const webpack = require('./webpack');

program
  .version(version)
  .option(
    '--loglevel <loglevel>',
    'one of: error, warn, http, info, verbose, silly. Can also set through env var $BEDROCK_LOG_LEVEL',
    /^(error|warn|http|info|verbose|silly)$/i,
    'info',
  );

program.on('option:loglevel', loglevel => {
  // @todo see if this can get set earlier; currently if one does `--loglevel verbose` they don't see events that fire before `program.parse()` that only show info if loglevel is high enough. perhaps find a way to parse args earlier (i.e. twice)?
  log.setLogLevel(loglevel);
});

// If any of our parent directories are not `node_modules`, then we are in "dev mode", which basically means that we are Bedrock developers working on this package in the monorepo.
const isDevMode = !dirname(__dirname)
  .split('/')
  .includes('node_modules');

if (isDevMode) log.info('Bedrock Dev Mode on');

/**
 * Prepare user config: validate, convert all paths to absolute, assign defaults
 * @param {BedrockUserConfig} userConfig
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
    templates,
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

  // @deprecated - remove in v1.0.0
  if (templates) {
    log.warn(
      'bedrock.config.js prop "templates" is deprecated and has been renamed to "templateRenderers", please rename with no change to config needed. The bots have moved your config to correct spot for now, but this will stop working at 1.0.0',
    );
    config.templateRenderers = templates;
  }

  if (config.css) {
    config.rootRelativeCSS = config.css.map(c => {
      if (c.startsWith('http')) return c;
      return `/${relative(config.public, c)}`;
    });
  }

  if (config.js) {
    config.rootRelativeJs = config.js.map(j => {
      if (j.startsWith('http')) return j;
      return `/${relative(config.public, j)}`;
    });
  }

  const templateRendererResults = validateUniqueIdsInArray(
    config.templateRenderers,
  );
  if (!templateRendererResults.ok) {
    log.error(
      `Each templateRenderer must have a unique id, these do not: ${
        templateRendererResults.duplicateIdList
      }`,
    );
    process.exit(1);
  }

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

  bedrockEvents.emit(EVENTS.CONFIG_READY, config);

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
async function buildBedrock(config) {
  try {
    await copy(join(__dirname, '../../dist/'), config.dist, {
      overwrite: true,
    });
    log.info('Bedrock core built', null, 'build');
  } catch (e) {
    log.error('Bedrock core build error!', e, 'build');
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

const patterns = new Patterns({
  newPatternDir: config.newPatternDir,
  patternPaths: config.patterns,
  dataDir: config.data,
  templateRenderers: config.templateRenderers,
  rootRelativeCSS: config.rootRelativeCSS,
  rootRelativeJs: config.rootRelativeJs,
});

const allTemplatePaths = patterns.getAllTemplatePaths();

config.templateRenderers.forEach(templateRenderer => {
  if (templateRenderer.init) {
    templateRenderer.init({
      config,
      allPatterns: patterns.getPatterns(),
      templatePaths: allTemplatePaths.filter(t => templateRenderer.test(t)),
    });
    log.info('Init done', null, `templateRenderer:${templateRenderer.id}`);
  }
});
log.verbose('All templateRenderers init done');
// const userPkgPath = join(process.cwd(), 'package.json');
// let userPkg = {};
// if (existsSync(userPkgPath)) userPkg = require(userPkgPath); // eslint-disable-line
// const { scripts } = userPkg;

program.command('serve').action(async () => {
  log.info('Serving...');
  const meta = await getMeta();
  await serve({
    config,
    meta,
    patterns,
  });
});

program.command('build').action(async () => {
  log.info('Building...');
  await emptyDir(config.dist);
  await buildBedrock(config);
  await Promise.all(
    config.templateRenderers.map(async templateRenderer => {
      if (!templateRenderer.build) return;
      await templateRenderer.build({
        config,
        templatePaths: allTemplatePaths.filter(t => templateRenderer.test(t)),
      });
      log.info('Built', null, `templateRender:${templateRenderer.id}`);
    }),
  );
  log.info('Bedrock built', null, 'build');
});

program.command('start').action(async () => {
  log.info('Starting...');
  const meta = await getMeta();
  await buildBedrock(config);
  const templateRendererWatches = config.templateRenderers.filter(t => t.watch);

  return Promise.all([
    patterns.watch(),
    ...templateRendererWatches.map(t =>
      t.watch({
        config,
        templatePaths: allTemplatePaths.filter(templatePath =>
          t.test(templatePath),
        ),
      }),
    ),
    serve({
      config,
      meta,
      patterns,
    }),
  ])
    .then(() => log.info('Started!', null, 'start'))
    .catch(err => {
      log.error('Bedrock start error', err, 'start');
      process.exit(1);
    });
});

program.parse(process.argv);
if (!program.args.length) program.help();
