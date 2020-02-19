#! /usr/bin/env node
/**
 *  Copyright (C) 2018 Basalt
    This file is part of Knapsack.
    Knapsack is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Knapsack is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Knapsack; if not, see <https://www.gnu.org/licenses>.
 */
import program from 'commander';
import { join } from 'path';
import {
  createProxyMiddleware,
  Filter,
  Options,
  RequestHandler,
} from 'http-proxy-middleware';
import { readJSONSync } from 'fs-extra';
import * as log from './log';
import { knapsackEvents, EVENTS, KnapsackEventsData } from '../server/events';
import { getServer } from '../server/server';
import {
  initAll,
  build,
  testPatternRenders,
  writeTemplateMeta,
} from './commands';
import { bootstrapFromConfigFile } from '../lib/bootstrap';

const { version } = readJSONSync(join(__dirname, '../../package.json'));

program
  .version(version)
  .option(
    '--loglevel <loglevel>',
    'one of: error, warn, http, info, verbose, silly. Can also set through env var $knapsack_LOG_LEVEL',
    /^(error|warn|http|info|verbose|silly)$/i,
    'info',
  );

program.on('option:loglevel', loglevel => {
  // @todo see if this can get set earlier; currently if one does `--loglevel verbose` they don't see events that fire before `program.parse()` that only show info if loglevel is high enough. perhaps find a way to parse args earlier (i.e. twice)?
  log.setLogLevel(loglevel);
});

const configPath = join(process.cwd(), 'knapsack.config.js');

const ksBrain = bootstrapFromConfigFile(configPath);

const { patterns, config, assetSets } = ksBrain;

program.command('serve').action(async () => {
  const meta = await initAll(ksBrain);
  log.info('Serving...');
  try {
    await getServer({ meta }).then(({ serve }) => serve());
  } catch (e) {
    log.error('Knapsack serve error', e);
    process.exit(1);
  }
});

program.command('build').action(async () => {
  await initAll(ksBrain).catch(err => {
    log.error('Knapsack init error', err, 'init');
    process.exit(1);
  });
  await build({ config, patterns }).catch(err => {
    log.error('Knapsack build error', err, 'build');
    process.exit(1);
  });

  // @todo restore writing meta.json with useful demo url info
  // // writing meta
  // const patternDemos = patterns.getPatternsDemoUrls();
  // const patternsMeta = patternDemos.map(patternDemo => {
  //   const { templates } = patternDemo;
  //   return {
  //     title: patternDemo.title,
  //     id: patternDemo.id,
  //     templates: templates.map(template => ({
  //       title: template.title,
  //       id: template.id,
  //       demoUrls: template.demoUrls,
  //     })),
  //   };
  // });
  //
  // const metaPath = join(config.dist, 'meta.json');
  //
  // ensureDirSync(config.dist);
  // writeFileSync(
  //   metaPath,
  //   JSON.stringify(
  //     {
  //       patterns: patternsMeta,
  //     },
  //     null,
  //     '  ',
  //   ),
  // );

  knapsackEvents.emit(EVENTS.SHUTDOWN);
});

program.command('start').action(async () => {
  const meta = await initAll(ksBrain);
  log.info('Starting...');
  await writeTemplateMeta({
    allPatterns: patterns.allPatterns,
    templateRenderers: config.templateRenderers,
    distDir: config.dist,
  });
  const templateRendererWatches = config.templateRenderers.filter(t => t.watch);
  knapsackEvents.on(
    EVENTS.PATTERNS_DATA_READY,
    (allPatterns: KnapsackEventsData['PATTERNS_DATA_READY']) => {
      writeTemplateMeta({
        allPatterns,
        templateRenderers: config.templateRenderers,
        distDir: config.dist,
      });
    },
  );

  const { serve } = await getServer({ meta });

  return Promise.all([
    // patterns.watch(), // @todo restore
    assetSets.watch(),
    ...templateRendererWatches.map(t =>
      t.watch({
        templatePaths: patterns.getAllTemplatePaths({
          templateLanguageId: t.id,
        }),
      }),
    ),
    serve(),
  ])
    .then(() => log.info('Started!', null, 'start'))
    .catch(err => {
      log.error('Knapsack start error', err, 'start');
      process.exit(1);
    });
});

program.command('test').action(async () => {
  const meta = await initAll(ksBrain);
  await build({ patterns, config });
  await testPatternRenders(patterns.allPatterns, patterns);
  knapsackEvents.emit(EVENTS.SHUTDOWN);
});

program.command('upgrade-config').action(async () => {
  knapsackEvents.emit(EVENTS.SHUTDOWN);
});

program.parse(process.argv);
if (!program.args.length) program.help();
