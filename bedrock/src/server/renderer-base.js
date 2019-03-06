const chokidar = require('chokidar');
const { bedrockEvents, EVENTS } = require('./events');
const log = require('../cli/log');

/* eslint-disable class-methods-use-this, no-empty-function, no-unused-vars */
class BedrockRendererBase {
  constructor({ id, extension }) {
    /** @type {string} */
    this.id = id;
    /** @type {string} */
    this.extension = extension;
    this.outputDirName = `bedrock-renderer-${this.id}`;
    this.logPrefix = `templateRenderer:${this.id}`;
  }

  test(theTemplatePath) {
    return theTemplatePath.endsWith(this.extension);
  }

  getHead({ cssUrls = [], headJsUrls = [], inlineHead = '' }) {
    return `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          ${cssUrls
            .map(
              cssUrl =>
                `<link rel="stylesheet" type="text/css" href="${cssUrl}">`,
            )
            .join('\n')}
          ${headJsUrls
            .map(
              jsUrl =>
                `<script src="${jsUrl}" type="text/javascript"></script>`,
            )
            .join('\n')}
          ${inlineHead}
    </head>
    <body>
    `;
  }

  getFoot({
    jsUrls = [],
    inlineJs = '',
    inlineCss = '',
    inlineFoot = '',
  } = {}) {
    return `
    ${jsUrls
      .map(jsUrl => `<script src="${jsUrl}" type="text/javascript"></script>`)
      .join('\n')}
<style>${inlineCss}</style>
<script>${inlineJs}</script>
${inlineFoot}
</body>
</html>
    `;
  }

  wrapHtml({
    html,
    cssUrls = [],
    jsUrls = [],
    headJsUrls = [],
    inlineJs = '',
    inlineCss = '',
    inlineHead = '',
    inlineFoot = '',
  }) {
    return `
${this.getHead({ cssUrls, headJsUrls, inlineHead })}
<div>${html}</div>
${this.getFoot({ jsUrls, inlineJs, inlineCss, inlineFoot })}
`;
  }

  onChange({ path }) {
    bedrockEvents.emit(EVENTS.PATTERN_TEMPLATE_CHANGED, { path });
  }

  onAdd({ path }) {
    bedrockEvents.emit(EVENTS.PATTERN_TEMPLATE_ADDED, { path });
  }

  onRemove({ path }) {
    bedrockEvents.emit(EVENTS.PATTERN_TEMPLATE_REMOVED, { path });
  }

  getUsage() {
    return '';
  }

  watch({ config, templatePaths }) {
    return new Promise((resolve, reject) => {
      const watcher = chokidar.watch(templatePaths, {
        ignoreInitial: true,
      });

      watcher
        .on('add', path => this.onAdd({ path }))
        .on('change', path => this.onChange({ path }))
        .on('unlink', path => this.onRemove({ path }))
        .on('error', error => {
          log.error('Error watching', error, `templateRender:${this.id}`);
          reject(error);
        });

      watcher.on('ready', () => {
        log.silly(
          'Watching these files:',
          watcher.getWatched(),
          `templateRender:${this.id}`,
        );
        resolve();
      });
    });
  }
}

module.exports = {
  BedrockRendererBase,
};
