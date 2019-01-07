const { flattenArray } = require('../lib/utils');
const log = require('./log');

async function build(config, allTemplatePaths) {
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
  log.info('Bedrock built', null, 'build');
}

function testPatternRenders(allPatterns, patterns) {
  return Promise.all(
    allPatterns.map(async pattern =>
      Promise.all(
        pattern.templates.map(async template => {
          const datas = template.demoDatas ? template.demoDatas : [{}];

          return Promise.all(
            datas.map(async data => {
              const results = await patterns.render({
                patternId: pattern.id,
                templateId: template.id,
                data,
              });
              return {
                ok: results.ok,
                patternId: pattern.id,
                templateId: template.id,
              };
            }),
          );
        }),
      ),
    ),
  )
    .then(patternResults => {
      let exitCode = 0;
      const results = flattenArray(patternResults);

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
      const fails = patternResults.filter(p => p.ok).length;
      const msg = `${results.length} tests ran, ${fails} failed`;

      if (!ok) {
        log.error(msg, null, 'test');
        process.exit(1);
      }

      log.info(msg, null, 'test');

      return patternResults;
    })
    .catch(err => {
      log.error('Test error', err, 'test');
      process.exit(1);
    });
}

module.exports = {
  testPatternRenders,
  build,
};
