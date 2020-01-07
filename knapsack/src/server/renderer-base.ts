import chokidar from 'chokidar';
import { JsonSchemaObject } from '@knapsack/core/src/types';
import { compile, JSONSchema } from 'json-schema-to-typescript';
import { pascalCase } from 'change-case';
import { join } from 'path';
import fs from 'fs-extra';
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
} from '../schemas/patterns';
import { validateSpec } from '../lib/utils';

/* eslint-disable class-methods-use-this, no-empty-function, no-unused-vars */
export class KnapsackRendererBase implements KnapsackTemplateRendererBase {
  id: string;

  extension: string;

  language: string;

  outputDirName: string;

  logPrefix: string;

  cacheDir: string;

  outputDir: string;

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

  async init({
    cacheDir,
  }: {
    config: KnapsackConfig;
    patterns: import('@knapsack/app/src/server/patterns').Patterns;
    cacheDir: string;
  }): Promise<void> {
    this.cacheDir = cacheDir;
    this.outputDir = join(cacheDir, this.outputDirName);
    await fs.ensureDir(this.outputDir);
  }

  static formatCode = formatCode;

  static isSlottedText = isSlottedText;

  static isDataDemo = isDataDemo;

  static isTemplateDemo = isTemplateDemo;

  static isSlottedTemplateDemo = isSlottedTemplateDemo;

  static validateSpec = validateSpec;

  /**
   * Each sub-class should implement this themselves, probably using `KnapsackRendererBase.formatCode()`
   * This base implementation just returns the original code so it can be reliably ran
   * @see {KnapsackRendererBase.formatCode}
   */
  formatCode(code: string): string {
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
          ${inlineHead}
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
    isInIframe,
  }: {
    html: string;
  } & GetHeadParams &
    GetFootParams): string {
    return `
${this.getHead({ cssUrls, headJsUrls, inlineHead, isInIframe })}
${isInIframe ? `<div class="knapsack-wrapper">${html}</div>` : html}
${this.getFoot({ jsUrls, inlineJs, inlineCss, inlineFoot, isInIframe })}
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

  static async convertSchemaToTypeScriptDefs({
    schema,
    title,
    description = '',
    patternId,
    templateId,
    preBanner,
    postBanner,
  }: {
    schema: JsonSchemaObject;
    /**
     * Will become the `export`-ed `interface`
     */
    title: string;
    description?: string;
    patternId: string;
    templateId: string;
    preBanner?: string;
    postBanner?: string;
  }): Promise<string> {
    const theSchema = {
      ...schema,
      additionalProperties: false,
      description,
      title,
    };

    const bannerComment = `
/**
 * patternId: "${patternId}" templateId: "${templateId}"
 * This file was automatically generated by Knapsack.
 * DO NOT MODIFY IT BY HAND.
 * Instead, adjust it's spec, by either:
 * 1) go to "/patterns/${patternId}/${templateId}" and use the UI to edit the spec
 * 2) OR edit the "knapsack.pattern.${patternId}.json" file's "spec.props".
 * Run Knapsack again to regenerate this file.
 */`.trim();

    const typeDefs = await compile(theSchema as JSONSchema, theSchema.title, {
      bannerComment: [preBanner, bannerComment, postBanner]
        .filter(Boolean)
        .join('\n\n'),
      style: {
        singleQuote: true,
      },
    });

    return typeDefs
      .split('\n')
      .map(line => line.replace('export type', 'type'))
      .join('\n');
  }
}
