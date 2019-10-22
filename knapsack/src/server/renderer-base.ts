import chokidar from 'chokidar';
import { knapsackEvents, EVENTS } from './events';
import * as log from '../cli/log';
import {
  GetHeadParams,
  GetFootParams,
  KnapsackTemplateRendererBase,
  KnapsackConfig,
} from '../schemas/knapsack-config';

/* eslint-disable class-methods-use-this, no-empty-function, no-unused-vars */
export class KnapsackRendererBase implements KnapsackTemplateRendererBase {
  id: string;

  extension: string;

  language: string;

  outputDirName: string;

  logPrefix: string;

  constructor({
    id,
    extension,
    language = '',
  }: {
    id: string;
    extension: string;
    language?: string;
  }) {
    this.id = id;
    this.extension = extension;
    this.language = language;
    this.outputDirName = `knapsack-renderer-${this.id}`;
    this.logPrefix = `templateRenderer:${this.id}`;
  }

  test(theTemplatePath) {
    return theTemplatePath.endsWith(this.extension);
  }

  getHead({
    cssUrls = [],
    headJsUrls = [],
    inlineHead = '',
  }: GetHeadParams): string {
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
  }: GetFootParams): string {
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
  }: {
    html: string;
  } & GetHeadParams &
    GetFootParams): string {
    return `
${this.getHead({ cssUrls, headJsUrls, inlineHead })}
<div>${html}</div>
${this.getFoot({ jsUrls, inlineJs, inlineCss, inlineFoot })}
`;
  }

  onChange({ path }: { path: string }): void {
    knapsackEvents.emit(EVENTS.PATTERN_TEMPLATE_CHANGED, { path });
  }

  onAdd({ path }: { path: string }): void {
    knapsackEvents.emit(EVENTS.PATTERN_TEMPLATE_ADDED, { path });
  }

  onRemove({ path }: { path: string }): void {
    knapsackEvents.emit(EVENTS.PATTERN_TEMPLATE_REMOVED, { path });
  }

  watch({
    config,
    templatePaths,
  }: {
    config: KnapsackConfig;
    templatePaths: string[];
  }): Promise<void> {
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
