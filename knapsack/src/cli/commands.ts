import { flattenArray, flattenNestedArray } from '../lib/utils';
import * as log from './log';
import { Patterns } from '../schemas/main-types';

export async function build(config, allTemplatePaths) {
  log.info('Building...');
  await Promise.all(
    config.templateRenderers.map(async templateRenderer => {
      if (!templateRenderer.build) return;
      await templateRenderer.build({
        config,
        templatePaths: allTemplatePaths.filter(t => templateRenderer.test(t)),
      });
      log.info('Built', null, `templateRenderer:${templateRenderer.id}`);
    }),
  );
  log.info('Knapsack built', null, 'build');
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
