const { bedrockEvents, EVENTS, log } = require('@basalt/bedrock');
const chokidar = require('chokidar');

/* eslint-disable class-methods-use-this, no-empty-function, no-unused-vars */
class BedrockRenderer {
  constructor({ id, extension }) {
    this.id = id;
    this.extension = extension;
  }

  getHead({ cssUrls = [], headJsUrls = [] }) {
    return `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          ${cssUrls.map(
            cssUrl =>
              `<link rel="stylesheet" type="text/css" href="${cssUrl}">`,
          )}
          ${headJsUrls.map(jsUrl => `<script src="${jsUrl}"></script>`)}
    </head>
    <body>
    `;
  }

  getFoot({ jsUrls = [] } = {}) {
    return `
    ${jsUrls.map(jsUrl => `<script src="${jsUrl}"></script>`)}
<style>
  body {
    display: flex;
    justify-content: center;
    align-items: center;
  }
 
</style>
 <script>
  /**
  * Prevents the natural click behavior of any links within the iframe.
  * Otherwise the iframe reloads with the current page or follows the url provided.
  */
  const links = Array.prototype.slice.call(document.querySelectorAll('a'));
  links.forEach(function(link) {
    link.addEventListener('click', function(e){e.preventDefault();});
  });
</script>
</body>
</html>
    `;
  }

  wrapHtml({ html, cssUrls = [], jsUrls = [], headJsUrls = [] }) {
    return `
${this.getHead({ cssUrls, headJsUrls })}
${html}
${this.getFoot({ jsUrls })}
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

  /**
   * @param {Object} opt
   * @param {BedrockConfig} opt.config
   * @param {string[]} opt.templatePaths - absolute paths of templates for this renderer
   * @return {Promise<boolean>}
   */
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
        resolve(true);
      });
    });
  }
}

module.exports = BedrockRenderer;
