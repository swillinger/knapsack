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
import { version as iframeResizerVersion } from 'iframe-resizer/package.json';
import { fileExists, fileExistsOrExit, formatCode } from './server-utils';
import { emitPatternsDataReady } from './events';
import { FileDb2 } from './dbs/file-db';
import * as log from '../cli/log';
import {
  KnapsackPattern,
  KnapsackTemplateStatus,
  KnapsackPatternsConfig,
  KnapsackTemplateDemo,
  isTemplateDemo,
} from '../schemas/patterns';
import {
  KnapsackTemplateRenderer,
  KsRenderResults,
} from '../schemas/knapsack-config';
import { KnapsackDb, KnapsackFile } from '../schemas/misc';

export class Patterns
  implements
    KnapsackDb<{
      patterns: {
        [id: string]: KnapsackPattern;
      };
      templateStatuses: KnapsackTemplateStatus[];
    }> {
  configDb: FileDb2<KnapsackPatternsConfig>;

  dataDir: string;

  templateRenderers: {
    [id: string]: KnapsackTemplateRenderer;
  };

  allPatterns: KnapsackPattern[];

  byId: {
    [id: string]: KnapsackPattern;
  };

  private assetSets: import('./asset-sets').AssetSets;

  isReady: boolean;

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
    this.allPatterns = [];
    this.byId = {};
    this.isReady = false;

    // @todo should probably convert this at a higher level later
    templateRenderers.forEach(templateRenderer => {
      this.templateRenderers[templateRenderer.id] = templateRenderer;
    });
  }

  async init(): Promise<void> {
    await this.updatePatternsData();
  }

  async getData(): Promise<{
    patterns: { [id: string]: KnapsackPattern };
    templateStatuses: KnapsackTemplateStatus[];
  }> {
    await this.updatePatternsData();
    const templateStatuses = await this.getTemplateStatuses();
    return {
      templateStatuses,
      patterns: this.byId,
    };
  }

  async savePrep(data: {
    patterns: { [id: string]: KnapsackPattern };
    templateStatuses?: KnapsackTemplateStatus[];
  }): Promise<KnapsackFile[]> {
    const allFiles: KnapsackFile[] = [];

    await Promise.all(
      Object.keys(data.patterns).map(async id => {
        const pattern = data.patterns[id];
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
    // @todo handle patterns that were deleted / renamed

    return allFiles;
  }

  async updatePatternsData() {
    const patternDataFiles = await globby(
      `${join(this.dataDir, 'knapsack.pattern.*.json')}`,
      {
        expandDirectories: false,
        onlyFiles: true,
      },
    );
    const byId = {};
    await Promise.all(
      patternDataFiles.map(async fileName => {
        const pattern: KnapsackPattern = await readJSON(fileName);
        // @todo validate: template path exists, has template render that exists, using assetSets that exist
        byId[pattern.id] = pattern;
      }),
    );
    this.byId = byId;
    this.allPatterns = Object.values(byId);
    this.getAllTemplatePaths().forEach(path => {
      fileExistsOrExit(
        path,
        `This file should exist but it doesn't:
Resolved absolute path: ${path}
      `,
      );
    });
    this.isReady = true;
    log.info('Done: updatePatternsData');
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
  }: {
    /**
     * If provided, only templates for these languages will be provided.
     * @see {import('./renderer-base').KnapsackRendererBase}
     */
    templateLanguageId?: string;
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
          }
          // Object.values(template.demosById || {})
          //   .filter(isTemplateDemo)
          //   .filter(({ templateInfo }) => templateInfo.path)
          //   .forEach(demo => {
          //     allTemplatePaths.push(
          //       this.getTemplateDemoAbsolutePath({
          //         patternId: pattern.id,
          //         templateId: template.id,
          //         demoId: demo.id,
          //       }),
          //     );
          //   });
        });
    });

    return allTemplatePaths;
  }

  getTemplateAbsolutePath({ patternId, templateId }): string {
    const pattern = this.byId[patternId];
    if (!pattern) throw new Error(`Could not find pattern ${patternId}`);
    const template = pattern.templates.find(t => t.id === templateId);
    if (!template)
      throw new Error(
        `Could not find template ${templateId} in pattern ${patternId}`,
      );
    const relPath = join(this.dataDir, template.path);
    const path = join(process.cwd(), relPath);
    if (!fileExists(path)) throw new Error(`File does not exist: ${path}`);
    return path;
  }

  getTemplateDemoAbsolutePath({ patternId, templateId, demoId }): string {
    const pattern = this.byId[patternId];
    if (!pattern) throw new Error(`Could not find pattern ${patternId}`);
    const template = pattern.templates.find(t => t.id === templateId);
    if (!template)
      throw new Error(
        `Could not find template ${templateId} in pattern ${patternId}`,
      );
    const demo = template.demosById[demoId];
    if (!demo)
      throw new Error(
        `Could not find demo "${demoId}" in template ${templateId} in pattern ${patternId}`,
      );
    if (!isTemplateDemo(demo)) {
      throw new Error(
        `Demo is not a "template" type of demo; cannot retrieve path for demo "${demoId}" in template ${templateId} in pattern ${patternId}`,
      );
    }
    if (!demo.templateInfo?.path) {
      throw new Error(
        `No "path" in demo "${demoId}" in template ${templateId} in pattern ${patternId}`,
      );
    }
    const relPath = join(this.dataDir, demo.templateInfo.path);
    const path = join(process.cwd(), relPath);
    if (!fileExists(path)) throw new Error(`File does not exist: ${path}`);
    return path;
  }

  async getTemplateStatuses(): Promise<KnapsackTemplateStatus[]> {
    const config = await this.configDb.getData();
    return config.templateStatuses;
  }

  // watch(): void {
  //   const configFilesToWatch = [];
  //   this.allPatterns.forEach(pattern => {
  //     configFilesToWatch.push(
  //       join(pattern.dir, FILE_NAMES.PATTERN_CONFIG),
  //       join(pattern.dir, FILE_NAMES.PATTERN_META),
  //       ...pattern.templates
  //         .filter(t => t.docPath)
  //         .map(t => join(pattern.dir, t.docPath)),
  //     );
  //   });
  //   const watcher = chokidar.watch(configFilesToWatch, {
  //     ignoreInitial: true,
  //   });
  //
  //   watcher.on('ready', () => {
  //     log.silly(
  //       `Core Patterns is watching these files:`,
  //       watcher.getWatched(),
  //       'patterns',
  //     );
  //   });
  // }

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

      const renderedTemplate = await renderer.render({
        pattern,
        template,
        // data: demoData || data || {},
        // data,
        demo,
        patternManifest: this,
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
        inlineHead,
        inlineFoot,
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
