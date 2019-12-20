import chokidar from 'chokidar';
import {
  validateDataAgainstSchema,
  validateSchema,
} from '@knapsack/schema-utils';
import { GenericResponse } from '@knapsack/core/src/types';
import { knapsackEvents, EVENTS } from './events';
import * as log from '../cli/log';
import { formatCode } from './server-utils';
import {
  GetHeadParams,
  GetFootParams,
  KnapsackTemplateRendererBase,
  KnapsackConfig,
} from '../schemas/knapsack-config';
import {
  isSlottedText,
  isDataDemo,
  isTemplateDemo,
  isSlottedTemplateDemo,
  KsTemplateSpec,
} from '../schemas/patterns';
import specSlotsSchema from '../json-schemas/schemaKsTemplateSpecSlots';

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
    language,
  }: {
    id: string;
    extension: string;
    language: string;
  }) {
    this.id = id;
    this.extension = extension;
    this.language = language;
    this.outputDirName = `knapsack-renderer-${this.id}`;
    this.logPrefix = `templateRenderer:${this.id}`;
  }

  static formatCode = formatCode;

  static isSlottedText = isSlottedText;

  static isDataDemo = isDataDemo;

  static isTemplateDemo = isTemplateDemo;

  static isSlottedTemplateDemo = isSlottedTemplateDemo;

  static validateSpec(spec: KsTemplateSpec): GenericResponse {
    let ok = true;
    const msgs: string[] = [];

    if (spec?.props) {
      const result = validateSchema(spec.props);
      if (!result.ok) {
        ok = false;
        msgs.push('Invalid "spec.props":');
        msgs.push(result.message);
      }
    }

    if (spec?.slots) {
      const result = validateDataAgainstSchema(specSlotsSchema, spec.slots);
      if (!result.ok) {
        ok = false;
        msgs.push('Invalid "spec.slots":');
        msgs.push(result.message);
        result.errors.forEach(e => msgs.push(e.message));
      }
    }

    return {
      ok,
      message: msgs.join('\n'),
    };
  }

  /**
   * Each sub-class should implement this themselves, probably using `KnapsackRendererBase.formatCode()`
   * This base implementation just returns the original code so it can be reliably ran
   * @see {KnapsackRendererBase.formatCode}
   */
  formatCode(code) {
    return code?.trim();
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

  watch({ templatePaths }: { templatePaths: string[] }): Promise<void> {
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
