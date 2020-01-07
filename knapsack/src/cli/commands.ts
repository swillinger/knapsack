import fs, { readFile } from 'fs-extra';
import portfinder from 'portfinder';
import findCacheDir from 'find-cache-dir';
import { isAbsolute, join, dirname } from 'path';
import { readJson } from '../server/server-utils';
import { flattenArray, flattenNestedArray, timer } from '../lib/utils';
import * as log from './log';
import { KnapsackBrain, Patterns } from '../schemas/main-types';
import {
  KnapsackConfig,
  KnapsackTemplateRenderer,
} from '../schemas/knapsack-config';
import { KnapsackPattern } from '../schemas/patterns';
import { KnapsackMeta, KnapsackFile } from '../schemas/misc';

export async function getMeta(config: KnapsackConfig): Promise<KnapsackMeta> {
  const { version, name } = await readJson(
    join(__dirname, '../../package.json'),
  );
  const cacheDir = findCacheDir({ name, create: true });
  const serverPort = await portfinder.getPortPromise({ port: 3999 });
  const websocketsPort = await portfinder.getPortPromise();
  return {
    websocketsPort,
    serverPort,
    knapsackVersion: version,
    cacheDir,
    changelog: config.changelog
      ? await readFile(config.changelog, 'utf8')
      : null,
    version: config.version,
    hasKnapsackCloud: 'cloud' in config,
  };
}

export async function initAll(ksBrain: KnapsackBrain): Promise<KnapsackMeta> {
  log.info('Initializing...');
  const { config, patterns } = ksBrain;
  const meta = await getMeta(config);
  await patterns.init({ cacheDir: meta.cacheDir });

  await Promise.all(
    config.templateRenderers.map(async templateRenderer => {
      if (templateRenderer.init) {
        await templateRenderer.init({
          config,
          patterns,
          cacheDir: meta.cacheDir,
        });
        log.info('Init done', null, `templateRenderer:${templateRenderer.id}`);
      }
    }),
  );

  log.info('Done: Initializing');
  return meta;
}

export async function writeTemplateMeta({
  templateRenderers,
  allPatterns,
  distDir,
}: {
  templateRenderers: KnapsackTemplateRenderer[];
  allPatterns: KnapsackPattern[];
  distDir: string;
}): Promise<void> {
  const getTime = timer();
  const metaDir = join(distDir, 'meta');
  await fs.emptyDir(metaDir);

  await Promise.all(
    templateRenderers
      .filter(t => t.getTemplateMeta)
      .map(async templateRenderer => {
        const templateMetaFiles: KnapsackFile[] = [];
        await Promise.all(
          allPatterns.map(async pattern => {
            return Promise.all(
              pattern.templates
                .filter(t => t.templateLanguageId === templateRenderer.id)
                .map(async template => {
                  const files = await templateRenderer.getTemplateMeta({
                    pattern,
                    template,
                  });

                  if (files?.length > 0) {
                    const dir = join(distDir, 'meta', pattern.id);
                    files
                      .map(file => ({
                        ...file,
                        path: join(dir, file.path),
                      }))
                      .forEach(file => templateMetaFiles.push(file));
                  }
                }),
            );
          }),
        );

        if (templateMetaFiles?.length > 0) {
          const filesToWrite = templateRenderer.alterTemplateMetaFiles
            ? await templateRenderer.alterTemplateMetaFiles({
                files: templateMetaFiles,
                metaDir,
              })
            : templateMetaFiles;
          await Promise.all(
            filesToWrite.map(async file => {
              await fs.ensureDir(dirname(file.path));
              const filePath = isAbsolute(file.path)
                ? file.path
                : join(metaDir, file.path);
              return fs.writeFile(filePath, file.contents, {
                encoding: file.encoding,
              });
            }),
          );
        }
      }),
  );
  log.verbose(`writeTemplateMeta took ${getTime()}s`);
}

export async function build({
  config,
  patterns,
}: {
  config: KnapsackConfig;
  patterns: Patterns;
}): Promise<void> {
  const getTime = timer();
  log.info('Building...');
  await writeTemplateMeta({
    allPatterns: patterns.allPatterns,
    templateRenderers: config.templateRenderers,
    distDir: config.dist,
  });
  await Promise.all(
    config.templateRenderers.map(async templateRenderer => {
      if (!templateRenderer.build) return;
      await templateRenderer.build({
        templatePaths: patterns.getAllTemplatePaths({
          templateLanguageId: templateRenderer.id,
        }),
      });
      log.info('Built', null, `templateRenderer:${templateRenderer.id}`);
    }),
  );

  log.info('Knapsack built', null, 'build');
  log.verbose(`Took ${getTime()}s`);
}

export async function testPatternRenders(
  allPatterns: KnapsackPattern[],
  patterns: Patterns,
): Promise<void> {
  const results = [];
  await Promise.all(
    allPatterns.map(async pattern =>
      Promise.all(
        pattern.templates.map(async template => {
          return Promise.all(
            template.demos.map(async demo => {
              const result = await patterns.render({
                patternId: pattern.id,
                templateId: template.id,
                demo: template.demosById[demo],
              });
              results.push({
                ok: result.ok,
                patternId: pattern.id,
                templateId: template.id,
              });
            }),
          );
        }),
      ),
    ),
  ).catch(err => {
    log.error('Test error', err, 'test');
    process.exit(1);
  });

  let exitCode = 0;

  results.forEach(result => {
    const { ok, patternId, templateId } = result;
    if (!ok) {
      exitCode = 1;
      log.error(
        `fail - Pattern: ${patternId} - Template: ${templateId}`,
        null,
        'test',
      );
    }
    log.info(
      `ok - Pattern: ${patternId} - Template: ${templateId}`,
      null,
      'test',
    );
  });

  const ok = exitCode === 0;
  const fails = results.filter(p => p.ok).length;
  const msg = `${results.length} tests ran, ${fails} failed`;

  if (!ok) {
    log.error(msg, null, 'test');
    process.exit(1);
  }

  log.info(msg, null, 'test');
}
