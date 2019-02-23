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
const { join, dirname } = require('path');
const log = require('./log');
const { bedrockEvents, EVENTS } = require('../server/events');
const { serve } = require('../server/server');
const { version } = require('../../package.json');
const { build, testPatternRenders } = require('./commands');
const { getMeta } = require('../lib/config');
const { bootstrapFromConfigFile } = require('../lib/bootstrap');

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

const configPath = join(process.cwd(), 'bedrock.config.js');

const { patterns, config } = bootstrapFromConfigFile(configPath);

const allTemplatePaths = patterns.getAllTemplatePaths();

program.command('serve').action(async () => {
  log.info('Serving...');
  const meta = await getMeta(config);
  await serve({ meta });
});

program.command('build').action(async () => {
  await build(config, allTemplatePaths);
  bedrockEvents.emit(EVENTS.SHUTDOWN);
});

program.command('start').action(async () => {
  log.info('Starting...');
  const meta = await getMeta(config);
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
    serve({ meta }),
  ])
    .then(() => log.info('Started!', null, 'start'))
    .catch(err => {
      log.error('Bedrock start error', err, 'start');
      process.exit(1);
    });
});

program.command('test').action(async () => {
  await build(config, allTemplatePaths);
  /** @type {BedrockPattern[]} */
  const allPatterns = await patterns.getPatterns();
  await testPatternRenders(allPatterns, patterns);
  bedrockEvents.emit(EVENTS.SHUTDOWN);
});

program.command('demo-urls').action(() => {
  const patternDemos = patterns.getPatternsDemoUrls();

  patternDemos.forEach(patternDemo => {
    patternDemo.templates.forEach(template => {
      const urlList = template.demoUrls.join('\n');
      console.log(`
${patternDemo.id} - ${template.id}    
${urlList}`);
    });
  });

  process.exit(0);
});

program.parse(process.argv);
if (!program.args.length) program.help();
