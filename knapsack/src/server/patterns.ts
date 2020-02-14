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
import { readJSON } from 'fs-extra';
import { join } from 'path';
import globby from 'globby';
import produce from 'immer';
import chokidar from 'chokidar';
import { version as iframeResizerVersion } from 'iframe-resizer/package.json';
import { validateDataAgainstSchema } from '@knapsack/schema-utils';
import {
  fileExists,
  fileExistsOrExit,
  formatCode,
  resolvePath,
} from './server-utils';
import { KnapsackRendererBase } from './renderer-base';
import { emitPatternsDataReady, EVENTS, knapsackEvents } from './events';
import { FileDb2 } from './dbs/file-db';
import * as log from '../cli/log';
import {
  KnapsackPattern,
  KnapsackTemplateStatus,
  KnapsackPatternsConfig,
  KnapsackTemplateDemo,
  isTemplateDemo,
  isDataDemo,
} from '../schemas/patterns';
import {
  KnapsackTemplateRenderer,
  KsRenderResults,
  TemplateRendererMeta,
} from '../schemas/knapsack-config';
import { KnapsackDb, KnapsackFile } from '../schemas/misc';
import { timer } from '../lib/utils';

type PatternsState = import('../client/store').AppState['patternsState'];
// type Old = {
//   patterns: {
//     [id: string]: KnapsackPattern;
//   };
//   templateStatuses: KnapsackTemplateStatus[];
// };

export class Patterns implements KnapsackDb<PatternsState> {
  configDb: FileDb2<KnapsackPatternsConfig>;

  dataDir: string;

  templateRenderers: {
    [id: string]: KnapsackTemplateRenderer;
  };

  byId: {
    [id: string]: KnapsackPattern;
  };

  private assetSets: import('./asset-sets').AssetSets;

  isReady: boolean;

  filePathsThatTriggerNewData: Map<string, string>;

  private watcher: chokidar.FSWatcher;

  cacheDir: string;

  constructor({
    dataDir,
    templateRenderers,
    assetSets,
  }: {
    dataDir: string;
    templateRenderers: KnapsackTemplateRenderer[];
    assetSets: import('./asset-sets').AssetSets;
  }) {
    this.configDb = new FileDb2<KnapsackPatternsConfig>({
      filePath: join(dataDir, 'knapsack.patterns.json'),
      defaults: {
        templateStatuses: [
          {
            id: 'draft',
            title: 'Draft',
            color: '#9b9b9b',
          },
          {
            id: 'inProgress',
            title: 'In Progress',
            color: '#FC0',
          },
          {
            id: 'ready',
            title: 'Ready',
            color: '#2ECC40',
          },
        ],
      },
    });

    this.assetSets = assetSets;
    this.dataDir = dataDir;
    this.templateRenderers = {};
    this.byId = {};
    this.isReady = false;
    this.filePathsThatTriggerNewData = new Map<string, string>();

    templateRenderers.forEach(templateRenderer => {
      this.templateRenderers[templateRenderer.id] = templateRenderer;
    });

    this.watcher = chokidar.watch([], {
      ignoreInitial: true,
    });

    this.watcher.on('change', async path => {
      const patternConfigFilePath = this.filePathsThatTriggerNewData.get(path);
      log.verbose(
        `changed file - path: ${path} patternConfigFilePath: ${patternConfigFilePath}`,
        null,
        'pattern data',
      );
      await this.updatePatternData(patternConfigFilePath);
      emitPatternsDataReady(this.allPatterns);
    });

    knapsackEvents.on(EVENTS.SHUTDOWN, () => this.watcher.close());
  }

  async init({ cacheDir }: { cacheDir: string }): Promise<void> {
    this.cacheDir = cacheDir;
    try {
      await this.updatePatternsData();
    } catch (error) {
      console.log();
      console.log(error);
      log.error('Pattern Init failed', error.message);
      console.log();
      log.verbose('', error);
      process.exit(1);
    }
  }

  get allPatterns(): KnapsackPattern[] {
    return Object.values(this.byId);
  }

  getRendererMeta(): { [id: string]: { meta: TemplateRendererMeta } } {
    const results: { [id: string]: { meta: TemplateRendererMeta } } = {};
    Object.entries(this.templateRenderers).forEach(([id, renderer]) => {
      const meta = renderer.getMeta();
      results[id] = {
        meta,
      };
    });
    return results;
  }

  async getData(): Promise<
    import('../client/store').AppState['patternsState']
  > {
    if (!this.byId) {
      await this.updatePatternsData();
    }
    const templateStatuses = await this.getTemplateStatuses();
    return {
      templateStatuses,
      patterns: this.byId,
      renderers: this.getRendererMeta(),
    };
  }

  async savePrep(data: {
    patterns: { [id: string]: KnapsackPattern };
    templateStatuses?: KnapsackTemplateStatus[];
  }): Promise<KnapsackFile[]> {
    const patternIdsToDelete = new Set(Object.keys(this.byId));
    this.byId = {};
    const allFiles: KnapsackFile[] = [];

    await Promise.all(
      Object.keys(data.patterns).map(async id => {
        const pattern = data.patterns[id];

        pattern.templates.forEach(template => {
          if (template?.spec?.isInferred) {
            // if it's inferred, we don't want to save `spec.props` or `spec.slots`
            template.spec = {
              isInferred: template?.spec?.isInferred,
            };
          }
        });

        this.byId[id] = pattern;
        patternIdsToDelete.delete(id);

        const db = new FileDb2<KnapsackPattern>({
          filePath: join(this.dataDir, `knapsack.pattern.${id}.json`),
          type: 'json',
          watch: false,
          writeFileIfAbsent: false,
        });

        const files = await db.savePrep(pattern);
        files.forEach(file => allFiles.push(file));
      }),
    );

    patternIdsToDelete.forEach(id => {
      allFiles.push({
        isDeleted: true,
        contents: '',
        encoding: 'utf8',
        path: join(this.dataDir, `knapsack.pattern.${id}.json`),
      });
    });

    return allFiles;
  }

  async updatePatternData(patternConfigPath: string): Promise<void> {
    const finish = timer();
    const pattern: KnapsackPattern = await readJSON(patternConfigPath);
    let { templates = [] } = pattern;
    // @todo validate: has template render that exists, using assetSets that exist
    templates = await Promise.all(
      templates.map(async template => {
        let { spec = {} } = template;
        // if we come across `{ typeof: 'function' }` in JSON Schema, the demo won't validate since we store as a string - i.e. `"() => alert('hi')"`, so we'll turn it into a string:
        const propsValidationSchema = produce(spec?.props, draft => {
          Object.values(draft?.properties || {}).forEach(prop => {
            if ('typeof' in prop && prop.typeof === 'function') {
              delete prop.typeof;
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              prop.type = 'string';
            }
          });
        });

        if (template.demosById) {
          // validating data demos against spec
          Object.values(template.demosById).forEach((demo, i) => {
            if (isDataDemo(demo) && spec?.props) {
              const results = validateDataAgainstSchema(
                propsValidationSchema,
                demo.data.props,
              );
              if (!results.ok) {
                log.inspect(
                  { propsSpec: spec.props, demo, results },
                  'invalid demo info',
                );
                log.warn(
                  `invalid demo: patternId: "${pattern.id}", templateId: "${template.id}", demoId: "${demo.id}" ^^^`,
                  'pattern data',
                );
              }
            }

            if (isTemplateDemo(demo)) {
              const { exists, absolutePath, relativePathFromCwd } = resolvePath(
                {
                  path: template.path,
                  resolveFromDirs: [this.dataDir],
                },
              );

              if (!exists) {
                log.error('Template demo file does not exist!', {
                  patternId: pattern.id,
                  templateId: template.id,
                  demoId: demo.id,
                  path: template.path,
                  resolvedAbsolutePath: absolutePath,
                });
                throw new Error(`Template demo file does not exist!`);
              }

              this.filePathsThatTriggerNewData.set(
                absolutePath,
                patternConfigPath,
              );
            }
          });
        }

        // inferring specs
        if (spec?.isInferred) {
          const renderer = this.templateRenderers[template.templateLanguageId];
          if (renderer?.inferSpec) {
            const pathToInferSpecFrom =
              typeof spec.isInferred === 'string'
                ? spec.isInferred
                : template.path;
            const { exists, absolutePath } = resolvePath({
              path: pathToInferSpecFrom,
              resolveFromDirs: [this.dataDir],
            });

            if (!exists) {
              throw new Error(`File does not exist: "${pathToInferSpecFrom}"`);
            }
            this.filePathsThatTriggerNewData.set(
              absolutePath,
              patternConfigPath,
            );
            try {
              const inferredSpec = await renderer.inferSpec({
                templatePath: absolutePath,
                template,
              });
              if (inferredSpec === false) {
                log.warn(
                  `Could not infer spec of pattern "${pattern.id}", template "${template.id}"`,
                  { absolutePath },
                );
              } else {
                const { ok, message } = KnapsackRendererBase.validateSpec(
                  inferredSpec,
                );
                if (!ok) {
                  throw new Error(message);
                }
                log.verbose(
                  `Success inferring spec of pattern "${pattern.id}", template "${template.id}"`,
                  inferredSpec,
                );
                spec = {
                  ...spec,
                  ...inferredSpec,
                };
              }
            } catch (err) {
              console.log(err);
              console.log();
              log.error(
                `Error inferring spec of pattern "${pattern.id}", template "${template.id}": ${err.message}`,
                {
                  absolutePath,
                },
              );
              process.exit(1);
            }
          }
        }
        const { ok, message } = KnapsackRendererBase.validateSpec(spec);

        if (!ok) {
          const msg = [
            `Spec did not validate for pattern "${pattern.id}" template "${template.id}"`,
            message,
          ].join('\n');
          log.error('Spec that failed', {
            spec,
          });
          throw new Error(msg);
        }

        return {
          ...template,
          spec,
        };
      }),
    );

    this.byId[pattern.id] = {
      ...pattern,
      templates,
    };
    log.silly(`${finish()}s for ${pattern.id}`, null, 'pattern data');
  }

  async updatePatternsData() {
    const s = timer();
    this.watcher.unwatch([...this.filePathsThatTriggerNewData.values()]);
    this.filePathsThatTriggerNewData.clear();
    const patternDataFiles = await globby(
      `${join(this.dataDir, 'knapsack.pattern.*.json')}`,
      {
        expandDirectories: false,
        onlyFiles: true,
      },
    );

    // Initially creating the patterns `this.byId` object in alphabetical order so that everywhere else patterns are listed they are alphabetical
    patternDataFiles
      .map(file => {
        // turns this: `data/knapsack.pattern.card-grid.json`
        // into this: `[ 'data/', 'card-grid.json' ]`
        const [, lastPart] = file.split('knapsack.pattern.');
        // now we have `card-grid`
        const id = lastPart.replace('.json', '');
        return id;
      })
      .sort()
      .forEach(id => {
        this.byId[id] = {
          id,
          title: id,
          templates: [],
        };
      });

    await Promise.all(
      patternDataFiles.map(async file => {
        this.filePathsThatTriggerNewData.set(file, file);
        return this.updatePatternData(file);
      }),
    );
    this.getAllTemplatePaths().forEach(path => {
      fileExistsOrExit(
        path,
        `This file should exist but it doesn't:
Resolved absolute path: ${path}
      `,
      );
    });
    this.watcher.add([...this.filePathsThatTriggerNewData.values()]);

    this.isReady = true;
    log.verbose(`updatePatternsData took: ${s()}`, null, 'pattern data');
    emitPatternsDataReady(this.allPatterns);
  }

  getPattern(id: string): KnapsackPattern {
    return this.byId[id];
  }

  getPatterns(): KnapsackPattern[] {
    return this.allPatterns;
  }

  /**
   * Get all the pattern's template file paths
   * @return - paths to all template files
   */
  getAllTemplatePaths({
    templateLanguageId = '',
    includeTemplateDemos = true,
  }: {
    /**
     * If provided, only templates for these languages will be provided.
     * @see {import('./renderer-base').KnapsackRendererBase}
     */
    templateLanguageId?: string;
    includeTemplateDemos?: boolean;
  } = {}): string[] {
    const allTemplatePaths = [];
    this.allPatterns.forEach(pattern => {
      pattern.templates
        .filter(t => t.path) // some just use `alias`
        .forEach(template => {
          if (
            templateLanguageId === '' ||
            template.templateLanguageId === templateLanguageId
          ) {
            allTemplatePaths.push(
              this.getTemplateAbsolutePath({
                patternId: pattern.id,
                templateId: template.id,
              }),
            );
            if (includeTemplateDemos) {
              Object.values(template?.demosById || {})
                .filter(isTemplateDemo)
                .forEach(demo => {
                  allTemplatePaths.push(
                    this.getTemplateDemoAbsolutePath({
                      patternId: pattern.id,
                      templateId: template.id,
                      demoId: demo.id,
                    }),
                  );
                });
            }
          }
        });
    });

    return allTemplatePaths;
  }

  getTemplateAbsolutePath({ patternId, templateId }): string {
    const pattern = this.byId[patternId];
    if (!pattern) throw new Error(`Could not find pattern "${patternId}"`);
    const template = pattern.templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error(
        `Could not find template "${templateId}" in pattern "${patternId}"`,
      );
    }
    const { exists, absolutePath } = resolvePath({
      path: template.path,
      resolveFromDirs: [this.dataDir],
    });

    if (!exists) throw new Error(`File does not exist: "${template.path}"`);
    return absolutePath;
  }

  getTemplateDemoAbsolutePath({ patternId, templateId, demoId }): string {
    const pattern = this.byId[patternId];
    if (!pattern) throw new Error(`Could not find pattern ${patternId}`);
    const template = pattern.templates.find(t => t.id === templateId);
    if (!template)
      throw new Error(
        `Could not find template "${templateId}" in pattern "${patternId}"`,
      );
    const demo = template.demosById[demoId];
    if (!demo)
      throw new Error(
        `Could not find demo "${demoId}" in template ${templateId} in pattern ${patternId}`,
      );
    if (!isTemplateDemo(demo)) {
      throw new Error(
        `Demo is not a "template" type of demo; cannot retrieve path for demo "${demoId}" in template "${templateId}" in pattern "${patternId}"`,
      );
    }
    if (!demo.templateInfo?.path) {
      throw new Error(
        `No "path" in demo "${demoId}" in template "${templateId}" in pattern "${patternId}"`,
      );
    }
    const relPath = join(this.dataDir, demo.templateInfo.path);
    const path = join(process.cwd(), relPath);
    if (!fileExists(path)) throw new Error(`File does not exist: "${path}"`);
    return path;
  }

  async getTemplateStatuses(): Promise<KnapsackTemplateStatus[]> {
    const config = await this.configDb.getData();
    return config.templateStatuses;
  }

  /**
   * Render template
   */
  async render({
    patternId,
    templateId = '',
    // demoDataId,
    demo,
    isInIframe = false,
    websocketsPort,
    assetSetId,
  }: {
    patternId: string;
    templateId: string;
    /**
     * Demo data to pass to template
     */
    demo?: KnapsackTemplateDemo;
    /**
     * Demo data id to pass to template
     */
    demoDataId?: string;
    /**
     * Will this be in an iFrame?
     */
    isInIframe?: boolean;
    websocketsPort?: number;
    assetSetId?: string;
  }): Promise<KsRenderResults> {
    try {
      const pattern = this.getPattern(patternId);
      if (!pattern) {
        const message = `Pattern not found: '${patternId}'`;
        return {
          ok: false,
          html: `<p>${message}</p>`,
          wrappedHtml: `<p>${message}</p>`,
          message,
        };
      }

      const template = pattern.templates.find(t => t.id === templateId);
      if (!template) {
        throw new Error(
          `Could not find template ${templateId} in pattern ${patternId}`,
        );
      }

      const renderer = this.templateRenderers[template.templateLanguageId];

      // const demoData = null;
      // @todo restore
      // const demoData = demoDataId ? template.demosById[demoDataId] : null;

      const renderedTemplate = await renderer
        .render({
          pattern,
          template,
          // data: demoData || data || {},
          // data,
          demo,
          patternManifest: this,
        })
        .catch(e => {
          log.error('Error', e, 'pattern render');
          const html = `<p>${e.message}</p>`;
          return {
            ok: false,
            html,
            wrappedHtml: html,
            usage: html,
            message: e.message,
          };
        });

      if (!renderedTemplate.ok) {
        return {
          ...renderedTemplate,
          wrappedHtml: renderedTemplate.html, // many times error messages are in the html for users
        };
      }

      const globalAssetSets = this.assetSets.getGlobalAssetSets();
      let assetSet = globalAssetSets ? globalAssetSets[0] : globalAssetSets[0];
      if (assetSetId) {
        assetSet = this.assetSets.getAssetSet(assetSetId);
      }

      const {
        assets = [],
        inlineJs = '',
        inlineCss = '',
        inlineFoot = '',
        inlineHead = '',
      } = assetSet ?? {};

      const inlineJSs = [inlineJs];
      const inlineHeads = [inlineHead];
      if (isInIframe) {
        // Need just a little bit of space around the pattern
        inlineHeads.push(`
<style>
.knapsack-wrapper {
  padding: 5px;
}
</style>
        `);
        inlineJSs.push(`
/**
  * Prevents the natural click behavior of any links within the iframe.
  * Otherwise the iframe reloads with the current page or follows the url provided.
  */
const links = Array.prototype.slice.call(document.querySelectorAll('a'));
links.forEach(function(link) {
  link.addEventListener('click', function(e){e.preventDefault();});
});

window.iFrameResizer = {
  onReady: function() {
    // https://github.com/davidjbradshaw/iframe-resizer/blob/master/docs/iframed_page/methods.md
    if ('parentIFrame' in window) {
       parentIFrame.sendMessage({
        type: 'event',
        event: 'ready',
      });
    }
  }
}
        `);
      }

      if (!isInIframe && websocketsPort) {
        inlineJSs.push(`
if ('WebSocket' in window && location.hostname === 'localhost') {
  var socket = new window.WebSocket('ws://localhost:${websocketsPort}');
  socket.addEventListener('message', function() {
    window.location.reload();
  });
}
          `);
      }

      const jsUrls = assets
        .filter(asset => asset.type === 'js')
        .filter(asset => asset.tagLocation !== 'head')
        .map(asset => this.assetSets.getAssetPublicPath(asset.src));

      const headJsUrls = assets
        .filter(asset => asset.type === 'js')
        .filter(asset => asset.tagLocation === 'head')
        .map(asset => this.assetSets.getAssetPublicPath(asset.src));

      const wrappedHtml = renderer.wrapHtml({
        html: renderedTemplate.html,
        headJsUrls: [
          ...headJsUrls,
          isInIframe
            ? `https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/${iframeResizerVersion}/iframeResizer.contentWindow.min.js`
            : '',
        ].filter(x => x),
        cssUrls: assets
          .filter(asset => asset.type === 'css')
          // .map(asset => asset.publicPath),
          .map(asset => this.assetSets.getAssetPublicPath(asset.src)),
        jsUrls,
        inlineJs: inlineJSs.join('\n'),
        inlineCss,
        inlineHead: inlineHeads.join('\n'),
        inlineFoot,
        isInIframe,
      });
      return {
        ...renderedTemplate,
        usage: renderer.formatCode(renderedTemplate.usage),
        html: formatCode({
          code: renderedTemplate.html,
          language: 'html',
        }),
        wrappedHtml: formatCode({
          code: wrappedHtml,
          language: 'html',
        }),
      };
    } catch (error) {
      log.error(
        error.message,
        {
          patternId,
          templateId,
          demo,
          isInIframe,
          assetSetId,
          error,
        },
        'pattern render',
      );
      const html = `<h1>Error in Pattern Render</h1>
      <pre><code>${error.toString()}</pre></code>`;

      return {
        ok: false,
        html,
        message: html,
        wrappedHtml: html,
      };
    }
  }
}
