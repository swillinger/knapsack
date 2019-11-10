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
import GraphQLJSON from 'graphql-type-json';
import fs from 'fs-extra';
import { join, relative, resolve, parse } from 'path';
import globby from 'globby';
import { getFileSizes } from 'get-file-sizes';
import {
  validateSchemaAndAssignDefaults,
  validateUniqueIdsInArray,
} from '@knapsack/schema-utils';
import chokidar from 'chokidar';
import { version as iframeResizerVersion } from 'iframe-resizer/package.json';
import {
  createDemoUrl,
  writeJson,
  fileExists,
  fileExistsOrExit,
} from './server-utils';
import { knapsackEvents, EVENTS, emitPatternsDataReady } from './events';
import { FileDb } from './dbs/file-db';
import * as log from '../cli/log';
import { FILE_NAMES } from '../lib/constants';
import {
  patternSchema,
  patternMetaSchema,
  KnapsackPattern,
  KnapsackPatternTemplate,
  PatternMeta,
  PatternWithMeta,
  KnapsackPatternType,
  KnapsackPatternStatus,
  KnapsackPatternSettings,
  KnapsackPatternTemplateCode,
} from '../schemas/patterns';
import { GenericResponse } from '../schemas/misc';
import {
  KnapsackTemplateRenderer,
  KnapsackTemplateRenderResults,
} from '../schemas/knapsack-config';
import {
  KnapsackAssetSet,
  KnapsackAssetSetUserConfig,
} from '../schemas/asset-sets';

export { patternsTypeDef } from '../schemas/patterns';

function isRemoteUrl(url: string): boolean {
  return url.startsWith('http') || url.startsWith('//');
}

function processAssetSets({
  assetSets,
  publicDir,
  configPathBase,
}: {
  assetSets: KnapsackAssetSetUserConfig[];
  publicDir: string;
  configPathBase: string;
}): KnapsackAssetSet[] {
  return assetSets.map(assetSet => ({
    ...assetSet,
    assets: assetSet.assets.map(asset => {
      const isRemote = isRemoteUrl(asset.src);
      const src = isRemote ? asset.src : resolve(configPathBase, asset.src);

      if (!isRemote) {
        fileExistsOrExit(src);
        if (relative(publicDir, src).includes('..')) {
          log.error(
            `Some CSS or JS is not publically accessible! These must be either remote or places inside the "public" dir (${publicDir})`,
          );
          process.exit(1);
        }
      }

      const { ext } = parse(src);
      const [size] = getFileSizes([src]);

      return {
        src,
        // isInHead: asset.isInHead === true,
        publicPath: isRemote ? src : `/${relative(publicDir, src)}`,
        type: ext.replace('.', ''),
        sizeRaw: size.sizeRaw,
        sizeKb: size.sizeKb,
      };
    }),
  }));
}

function createPatternsData(
  patternsDirs: string[],
  templateRenderers: KnapsackTemplateRenderer[],
  scanAssetSets: (arg0: KnapsackAssetSetUserConfig[]) => KnapsackAssetSet[],
  globalAssetSets: KnapsackAssetSet[],
): KnapsackPattern[] {
  const patterns: KnapsackPattern[] = [];

  patternsDirs.forEach(dir => {
    // Clearing the `require()` cache so we can run this function many times
    // See https://nodejs.org/api/modules.html#modules_require_cache
    // @todo Only clear the `require()` cache for the files that have changed, instead of rebuilding the whole thing if a single file changes. Though it'll be hard in the case of nested Patterns.
    Object.keys(require.cache)
      .filter(cachedPath => cachedPath.startsWith(dir))
      .forEach(cachedPath => delete require.cache[cachedPath]);
    try {
      const patternConfigPath = join(dir, FILE_NAMES.PATTERN_CONFIG);
      /** @type {PatternWithMetaSchema} */
      const pattern = require(patternConfigPath); // eslint-disable-line
      if (pattern) {
        const results = validateSchemaAndAssignDefaults(patternSchema, pattern);
        if (!results.ok) {
          const name = dir.split('/').pop();
          console.log();
          console.error(
            `Error! Pattern Schema validation failed for "${name}"`,
            results.message,
          );
          // @todo show user better error messages like what fields are wrong
          console.error(
            `Review the "${FILE_NAMES.PATTERN_CONFIG}" in that folder and compare to "pattern.schema.json"`,
          );
          console.log();
          process.exit(1);
        }

        const templateValidation = validateUniqueIdsInArray(
          results.data.templates,
        );
        if (!templateValidation.ok) {
          log.error(
            `Each "template" must have a unique "id", in "${relative(
              process.cwd(),
              dir,
            )}" these do not: ${templateValidation.duplicateIdList}`,
            null,
            'patterns',
          );
          process.exit(1);
        }

        results.data.templates = results.data.templates.map(template => {
          const templatePath = join(dir, template.path);

          if (!fileExists(templatePath)) {
            log.error(
              `Pattern ${pattern.id} has a template (${template.id}) with a path that cannot be found: ${templatePath}`,
            );
            process.exit(1);
          }

          // ensure we have a templateRenderer for this template
          if (templateRenderers.findIndex(t => t.test(templatePath)) === -1) {
            log.error(
              `Pattern ${pattern.id} has a template ${template.id} with no associated renderer.`,
            );
            process.exit(1);
          }

          let doc = '';
          if (template.docPath) {
            const docPath = join(dir, template.docPath);
            if (!fileExists(docPath)) {
              log.error(
                `Template ${template.id} has a doc path that points to a file that cannot be found: ${docPath}`,
              );
              process.exit(1);
            }
            doc = fs.readFileSync(docPath, 'utf8');
          }

          const { schema, demoDatas, id: templateId } = template;

          const hasSchema = !!(
            schema &&
            schema.properties &&
            Object.keys(schema.properties).length > 0
          );

          let assetSets = [];
          if (template.assetSets) {
            assetSets = scanAssetSets(template.assetSets);
          }

          globalAssetSets.forEach(globalAssetSet => {
            if (!assetSets.some(a => a.id === globalAssetSet.id)) {
              assetSets.push(globalAssetSet);
            }
          });

          let datas = [{}];
          if (demoDatas) {
            datas = demoDatas;
          } else if (
            hasSchema &&
            schema.examples &&
            schema.examples.length > 0
          ) {
            datas = schema.examples;
          }

          const demoUrls = [];
          datas.forEach((data, demoDataIndex) => {
            assetSets.forEach(assetSet => {
              demoUrls.push(
                createDemoUrl({
                  patternId: pattern.id,
                  templateId,
                  assetSetId: assetSet.id,
                  isInIframe: false,
                  wrapHtml: true,
                  demoDataIndex,
                }),
              );
            });
          });

          const src = fs.readFileSync(templatePath, 'utf8');

          return {
            ...template,
            demoDatas: datas,
            demoUrls,
            absolutePath: templatePath,
            assetSets,
            doc,
            src,
          };
        });

        const metaFilePath = join(dir, FILE_NAMES.PATTERN_META);
        // eslint-disable-next-line
        const patternMeta: PatternMeta = require(metaFilePath);
        const metaResults = validateSchemaAndAssignDefaults(
          patternMetaSchema,
          patternMeta,
        );
        if (!metaResults.ok) {
          const name = dir.split('/').pop();
          console.log();
          console.error(
            `Error! Pattern Schema validation failed for "${name}"`,
            results.message,
          );
          console.error(
            `Review the "${pattern.metaFilePath}" in that folder and compare to "pattern.schema.json"`,
            metaFilePath,
          );
          console.log();
          process.exit(1);
        }

        const patternWithMeta: PatternWithMeta = {
          ...results.data,
          dir,
          metaFilePath, // replaces original relative one with absolute path
          meta: metaResults.data as PatternMeta,
        };

        patterns.push(patternWithMeta);
      }
    } catch (e) {
      log.error('Problem loading up Patterns', e);
      process.exit(1);
    }
  }); // end building up `patterns`

  const results = validateUniqueIdsInArray(patterns);
  if (!results.ok) {
    log.error(
      `Each "knapsack.pattern.js" must have a unique "id", these do not: ${results.duplicateIdList}`,
      null,
      'patterns',
    );
    process.exit(1);
  }
  emitPatternsDataReady(patterns);
  // knapsackEvents.emit(EVENTS.PATTERNS_DATA_READY, patterns);
  return patterns;
}

function getPatternsDirs(patternPaths: string[]): string[] {
  return globby
    .sync(patternPaths, {
      expandDirectories: true,
      onlyFiles: false,
    })
    .filter(
      thePath =>
        fs.statSync(thePath).isDirectory() &&
        fs.existsSync(join(thePath, FILE_NAMES.PATTERN_CONFIG)),
    );
}

export class Patterns {
  db: FileDb;

  scanAssetSets: (
    newAssetSets: KnapsackAssetSetUserConfig[],
  ) => KnapsackAssetSet[];

  globalAssetSets: KnapsackAssetSet[];

  newPatternDir: string;

  patternPaths: string[];

  dataDir: string;

  templateRenderers: KnapsackTemplateRenderer[];

  patternsDirs: string[];

  allPatterns: KnapsackPattern[];

  constructor({
    newPatternDir,
    patternPaths,
    dataDir,
    templateRenderers,
    assetSets,
    publicDir,
    configPathBase,
  }: {
    newPatternDir: string;
    patternPaths: string[];
    dataDir: string;
    templateRenderers: KnapsackTemplateRenderer[];
    assetSets: KnapsackAssetSetUserConfig[];
    publicDir: string;
    configPathBase: string;
  }) {
    this.db = new FileDb({
      dbDir: dataDir,
      name: 'knapsack.patterns',
      defaults: {
        patternStatuses: [
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
        patternTypes: [
          {
            id: 'components',
            title: 'Components',
          },
        ],
      },
    });

    this.scanAssetSets = newAssetSets =>
      processAssetSets({
        assetSets: newAssetSets,
        publicDir,
        configPathBase,
      });
    this.globalAssetSets = this.scanAssetSets(assetSets);
    this.newPatternDir = newPatternDir;
    this.patternPaths = patternPaths;
    this.dataDir = dataDir;
    this.templateRenderers = templateRenderers;
    this.patternsDirs = getPatternsDirs(this.patternPaths);
    this.allPatterns = createPatternsData(
      this.patternsDirs,
      this.templateRenderers,
      this.scanAssetSets,
      this.globalAssetSets,
    );
  }

  updatePatternsData() {
    this.patternsDirs = getPatternsDirs(this.patternPaths);
    this.allPatterns = createPatternsData(
      this.patternsDirs,
      this.templateRenderers,
      this.scanAssetSets,
      this.globalAssetSets,
    );
  }

  getPattern(id: string): KnapsackPattern {
    return this.allPatterns.find(p => p.id === id);
  }

  getPatterns(): KnapsackPattern[] {
    return this.allPatterns;
  }

  getPatternMeta(id: string): PatternMeta {
    const pattern = this.getPattern(id);
    return pattern.meta;
  }

  async setPatternMeta(
    id: string,
    meta: PatternMeta,
  ): Promise<GenericResponse> {
    const pattern = this.getPattern(id);
    try {
      await writeJson(pattern.metaFilePath, meta);
      // this.db.set(`${id}.meta`, meta);
      return {
        ok: true,
        message: `Pattern Meta for ${id} saved successfully`,
        data: {},
      };
    } catch (error) {
      return {
        ok: false,
        message: error.toString(),
        data: {},
      };
    }
  }

  /**
   * Get all the pattern's template file paths
   * @return - Absolute paths to all template files
   */
  getAllTemplatePaths(): string[] {
    const allTemplatePaths = [];
    this.allPatterns.forEach(pattern => {
      pattern.templates.forEach(template => {
        allTemplatePaths.push(template.absolutePath);
      });
    });
    return allTemplatePaths;
  }

  getAllAssetPaths(includeRemote = false): string[] {
    const paths: Set<string> = new Set();
    const patterns = this.getPatterns();
    patterns.forEach(pattern => {
      pattern.templates.forEach(template => {
        template.assetSets.forEach(({ assets }) => {
          assets.forEach(asset => {
            if (includeRemote) {
              paths.add(asset.src);
            } else if (!isRemoteUrl(asset.src)) {
              paths.add(asset.src);
            }
          });
        });
      });
    });

    return [...paths];
  }

  async setPatternTemplateReadme(
    id: string,
    templateId: string,
    readme: string,
  ): Promise<void> {
    const pattern = this.getPattern(id);
    const { docPath = null } =
      pattern.templates.find(t => t.id === templateId) || {};

    // Write to the file system
    await fs.writeFile(join(pattern.dir, docPath), readme);
  }

  getPatternTypes(): {
    id: string;
    title: string;
    patterns: KnapsackPattern[];
  }[] {
    const patterns = this.getPatterns();
    const patternTypes: KnapsackPatternType[] = this.db.get('patternTypes');
    return patternTypes.map(patternType => ({
      ...patternType,
      patterns: patterns.filter(
        pattern => pattern.meta.type === patternType.id,
      ),
    }));
  }

  /**
   * @param id - ID of pattern type
   */
  getPatternType(
    id: string,
  ): { id: string; title: string; patterns: KnapsackPattern[] } {
    return this.getPatternTypes().find(p => p.id === id);
  }

  setPatternTypes(patternTypes: KnapsackPatternType[]): KnapsackPatternType[] {
    this.db.set('patternTypes', patternTypes);
    return this.db.get('patternTypes');
  }

  getPatternStatuses(): KnapsackPatternStatus[] {
    return this.db.get('patternStatuses');
  }

  setPatternStatuses(
    patternStatuses: KnapsackPatternStatus[],
  ): KnapsackPatternStatus[] {
    this.db.set('patternStatuses', patternStatuses);
    return this.db.get('patternStatuses');
  }

  getPatternSettings(): KnapsackPatternSettings {
    return {
      ...this.db.getAll(),
      patternTypes: this.getPatternTypes(),
    };
  }

  setPatternSettings(settings: KnapsackPatternSettings): void {
    this.db.setAll(settings);
  }

  /**
   * Get a URL where this can be viewed
   */
  getPatternDemoUrl({
    patternId,
    templateId,
    assetSetId,
    data,
    demoDataIndex = 0,
  }: {
    patternId: string;
    /**
     * defaults to first template
     */
    templateId?: string;
    /**
     * defaults to first assetSet
     */
    assetSetId?: string;
    data?: object;
    demoDataIndex?: number;
  }): string {
    const pattern = this.getPattern(patternId);
    const template = templateId
      ? pattern.templates.find(t => t.id === templateId)
      : pattern.templates[0];

    let demoData = data || {};
    if (!data) {
      if (typeof demoDataIndex === 'number') {
        demoData = template.demoDatas[demoDataIndex];
      }
    }

    const demoUrl = createDemoUrl({
      patternId,
      templateId: template.id,
      assetSetId: assetSetId || template.assetSets[0].id,
      data: demoData,
      isInIframe: false,
      wrapHtml: true,
    });

    // @todo throw errors if insufficient data
    return demoUrl;
  }

  /**
   * @param {string} patternId
   * @return {{ id: string, title: string, demoUrls: string[] }[]}
   */
  getPatternDemoUrls(patternId) {
    const pattern = this.getPattern(patternId);

    return pattern.templates.map(template => ({
      id: template.id,
      title: template.title,
      demoUrls: template.demoUrls,
    }));
  }

  /**
   * @return {{templates: {id: string, title: string, demoUrls: string[]}[], id: Id, title: Title}[]}
   */
  getPatternsDemoUrls() {
    return this.getPatterns().map(pattern => ({
      id: pattern.id,
      title: pattern.meta.title,
      templates: this.getPatternDemoUrls(pattern.id),
    }));
  }

  /**
   * Get code strings to help with how this template is used
   */
  async getTemplateCode({
    patternId,
    templateId,
    data,
  }: {
    patternId: string;
    templateId: string;
    data?: object;
  }): Promise<KnapsackPatternTemplateCode> {
    const pattern = this.getPattern(patternId);
    const template = pattern.templates.find(t => t.id === templateId);
    const renderer = this.templateRenderers.find(t =>
      t.test(template.absolutePath),
    );

    let language = 'bash';
    if (renderer.language) {
      language = renderer.language; // eslint-disable-line
    } else if (renderer.extension) {
      language = renderer.extension.replace('.', '');
    }

    const results = await Promise.all([
      renderer
        .getUsage({ patternId, template, data })
        .then(usage => ({ usage })),
      this.render({
        patternId,
        templateId,
        data,
        wrapHtml: false,
        isInIframe: false,
      }).then(({ ok, html, message }) => {
        if (!ok) {
          log.error(`Error trying to getTemplateCode(): ${message}`, {
            patternId,
            templateId,
            html,
            message,
          });
          throw new Error(message);
        }
        return {
          html,
        };
      }),
    ]);

    const mergedResults = results.reduce(
      (prev, current) => Object.assign(prev, current),
      {},
    );
    return {
      language,
      templateSrc: template.src,
      html: '',
      usage: '',
      data,
      ...mergedResults,
    };
  }

  watch(): void {
    const configFilesToWatch = [];
    this.allPatterns.forEach(pattern => {
      configFilesToWatch.push(
        join(pattern.dir, FILE_NAMES.PATTERN_CONFIG),
        join(pattern.dir, FILE_NAMES.PATTERN_META),
        ...pattern.templates
          .filter(t => t.docPath)
          .map(t => join(pattern.dir, t.docPath)),
      );
    });
    const watcher = chokidar.watch(configFilesToWatch, {
      ignoreInitial: true,
    });

    watcher.on('ready', () => {
      log.silly(
        `Core Patterns is watching these files:`,
        watcher.getWatched(),
        'patterns',
      );
    });

    watcher.on('all', (event, path) => {
      knapsackEvents.emit(EVENTS.PATTERN_CONFIG_CHANGED, { event, path });
      this.updatePatternsData();
    });

    const localAssetPaths = this.getAllAssetPaths(false);

    const assetWatcher = chokidar.watch(localAssetPaths, {
      ignoreInitial: true,
    });

    assetWatcher.on('all', (event, path) => {
      knapsackEvents.emit(EVENTS.PATTERN_ASSET_CHANGED, { event, path });
    });
  }

  /**
   * Render template
   */
  async render({
    patternId,
    templateId = '',
    wrapHtml = true,
    data,
    demoDataIndex,
    isInIframe = false,
    websocketsPort,
    assetSetId,
  }: {
    patternId: string;
    templateId?: string;
    /**
     * Should it wrap HTML results with `<head>` and include assets?
     */
    wrapHtml?: boolean;
    /**
     * Data to pass to template
     */
    data?: object;
    /**
     * Demo data index to pass to template
     */
    demoDataIndex?: number;
    /**
     * Will this be in an iFrame?
     */
    isInIframe?: boolean;
    websocketsPort?: number;
    assetSetId?: string;
  }): Promise<KnapsackTemplateRenderResults> {
    const pattern = this.getPattern(patternId);
    if (!pattern) {
      const message = `Pattern not found: '${patternId}'`;
      return {
        ok: false,
        html: `<p>${message}</p>`,
        message,
      };
    }
    let [template] = pattern.templates;
    if (templateId) {
      template = pattern.templates.find(t => t.id === templateId);
    }

    const renderer = this.templateRenderers.find(t =>
      t.test(template.absolutePath),
    );

    const demoData = Number.isInteger(demoDataIndex)
      ? template.demoDatas[demoDataIndex]
      : null;

    const renderedTemplate = await renderer.render({
      pattern,
      template,
      data: demoData || data || {},
    });

    if (!renderedTemplate.ok) return renderedTemplate;

    if (wrapHtml) {
      const assetSet = assetSetId
        ? template.assetSets.find(a => a.id === assetSetId)
        : template.assetSets[0];

      const {
        assets,
        inlineJs = '',
        inlineCss = '',
        inlineFoot = '',
        inlineHead = '',
      } = assetSet;

      const inlineJSs = [inlineJs];

      if (isInIframe) {
        inlineJSs.push(`
/**
  * Prevents the natural click behavior of any links within the iframe.
  * Otherwise the iframe reloads with the current page or follows the url provided.
  */
const links = Array.prototype.slice.call(document.querySelectorAll('a'));
links.forEach(function(link) {
  link.addEventListener('click', function(e){e.preventDefault();});
});
        `);
      }

      if (!isInIframe && websocketsPort) {
        inlineJSs.push(`
if ('WebSocket' in window && location.hostname === 'localhost') {
  var socket = new window.WebSocket('ws://localhost:8000');
  socket.addEventListener('message', function() {
    window.location.reload();
  });
}
          `);
      }
      const wrappedHtml = renderer.wrapHtml({
        html: renderedTemplate.html,
        headJsUrls: [
          isInIframe
            ? `https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/${iframeResizerVersion}/iframeResizer.contentWindow.min.js`
            : '',
        ].filter(x => x),
        cssUrls: assets
          .filter(asset => asset.type === 'css')
          .map(asset => asset.publicPath),
        jsUrls: assets
          .filter(asset => asset.type === 'js')
          .map(asset => asset.publicPath),
        inlineJs: inlineJSs.join('\n'),
        inlineCss,
        inlineHead,
        inlineFoot,
      });
      return {
        ...renderedTemplate,
        html: wrappedHtml,
      };
    }
    return renderedTemplate;
  }
}

export const patternsResolvers = {
  Query: {
    patterns: (parent, args, { patterns }) => patterns.getPatterns(),
    pattern: (parent, { id }, { patterns }) => patterns.getPattern(id),
    templateCode: async (
      parent,
      { patternId, templateId, data },
      { patterns },
    ) => patterns.getTemplateCode({ patternId, templateId, data }),
    patternTypes: (parent, args, { patterns }) => patterns.getPatternTypes(),
    patternType: (parent, { id }, { patterns }) => patterns.getPatternType(id),
    patternStatuses: (parent, args, { patterns }) =>
      patterns.getPatternStatuses(),
    patternSettings: (parent, args, { patterns }) =>
      patterns.getPatternSettings(),
    render: async (
      parent,
      { patternId, templateId, wrapHtml, data },
      { patterns },
    ) => patterns.render({ patternId, templateId, wrapHtml, data }),
  },
  Mutation: {
    setPatternMeta: async (parent, { id, meta }, { patterns, canWrite }) => {
      if (!canWrite) return false;
      await patterns.setPatternMeta(id, meta);
      return patterns.getPatternMeta(id);
    },
    setPatternTypes: async (
      parent,
      { patternTypes },
      { patterns, canWrite },
    ) => {
      if (!canWrite) return false;
      return patterns.setPatternTypes(patternTypes);
    },
    setPatternStatuses: async (
      parent,
      { patternStatuses },
      { patterns, canWrite },
    ) => {
      if (!canWrite) return false;
      return patterns.setPatternStatuses(patternStatuses);
    },
    setPatternSettings: async (
      parent,
      { settings },
      { patterns, canWrite },
    ) => {
      if (!canWrite) return false;
      patterns.setPatternSettings(settings);
      return patterns.getPatternSettings();
    },
    setPatternTemplateReadme: async (
      parent,
      { id, templateId, readme },
      { patterns, canWrite },
    ) => {
      if (!canWrite) return false;
      await patterns.setPatternTemplateReadme(id, templateId, readme);
      return patterns.getPattern(id);
    },
  },
  JSON: GraphQLJSON,
};
