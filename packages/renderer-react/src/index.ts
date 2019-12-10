import {
  KnapsackRendererBase,
  KnapsackRendererWebpackBase,
} from '@knapsack/app';
import {
  KnapsackTemplateRenderer,
  KnapsackConfig,
  KnapsackTemplateRendererResults,
  KnapsackTemplateRendererBase,
  KnapsackRenderParams,
} from '@knapsack/app/src/schemas/knapsack-config';
import camelCase from 'camelcase';
import * as babel from '@babel/core';
import { readFile } from 'fs-extra';
import { join } from 'path';
import { copyReactAssets, getUsage, getDemoAppUsage } from './utils';

/* eslint-disable class-methods-use-this */

function upperCamelCase(str: string): string {
  const cased = camelCase(str);
  return cased.charAt(0).toUpperCase() + cased.slice(1);
}

type ImportInfo = {
  /**
   * Either the `KsButton` in `import { KsButton } from './button'` or the `KsButton` in `import KsButton from './button'`
   */
  name: string;
  isNamedImport?: boolean;
  path: string;
  patternId: string;
  templateId: string;
  demoId?: string;
};

export class KnapsackReactRenderer extends KnapsackRendererWebpackBase
  implements KnapsackTemplateRenderer {
  assets: string[];

  babelConfig: any;

  private demoWrapperPath: string;

  constructor({
    webpackConfig,
    webpack,
    babelConfig,
    demoWrapperPath = join(__dirname, './demo-wrapper.js'),
  }: {
    id: string;
    extension: string;
    webpackConfig: import('webpack').Configuration;
    webpack: typeof import('webpack');
    babelConfig: any;
    demoWrapperPath?: string;
  }) {
    super({
      id: 'react',
      extension: '.jsx',
      language: 'jsx',
      webpackConfig,
      webpack,
    });

    this.language = 'jsx';

    this.assets = [];

    this.babelConfig = babelConfig;

    this.demoWrapperPath = demoWrapperPath;
  }

  init: KnapsackTemplateRendererBase['init'] = ({
    patterns,
    config,
  }): ReturnType<KnapsackTemplateRendererBase['init']> => {
    super.init({ config, patterns });
    this.assets = copyReactAssets(this.distDirAbsolute, this.publicPath);
  };

  createWebpackEntryFromPatterns(
    patterns: import('@knapsack/app/src/server/patterns').Patterns,
  ): {} {
    const entry = super.createWebpackEntryFromPatterns(patterns);
    const id = 'demo-wrapper';
    if (entry[id]) {
      throw new Error(
        'Cannot have a pattern id of "demo" that contains a template id of "wrapper"',
      );
    }
    return {
      [id]: this.demoWrapperPath,
      'error-catcher': join(__dirname, './error-catcher.js'),
      ...entry,
    };
  }

  babelTransform(code: string): Promise<string> {
    return new Promise((resolve, reject) => {
      babel.transform(code, this.babelConfig, (err, results) => {
        if (err) {
          console.error('Babel transform error', err);
          reject(err);
        } else {
          resolve(results.code);
        }
      });
    });
  }

  async prepClientRenderResults({
    webpackScriptSrcs,
    usage,
    demoApp,
  }: {
    usage: string;
    demoApp: string;
    webpackScriptSrcs: string[];
  }): Promise<KnapsackTemplateRendererResults> {
    if (!this.webpackManifest) await this.setManifest();

    let code = `
const root = document.getElementById('render-root');
const DemoWrapper = window.knapsack['demo-wrapper'].default;
const ErrorCatcher = window.knapsack['error-catcher'].default;

${demoApp}

ReactDOM.render(
  <ErrorCatcher>
    <DemoWrapper>
      <DemoApp />
    </DemoWrapper>
  </ErrorCatcher>,
  root
);
    `;

    code = await this.babelTransform(code);
    code = KnapsackRendererWebpackBase.formatCode({
      code,
      language: 'js',
    });

    const html = `
${this.assets.map(asset => `<script src="${asset}"></script>`).join('')}
<script src="${this.getWebPackEntryPath('demo-wrapper')}"></script>
<script src="${this.getWebPackEntryPath('error-catcher')}"></script>
${webpackScriptSrcs
  .map(webpackScriptSrc => `<script src="${webpackScriptSrc}"></script>`)
  .join('\n')}
<div id="render-root" data-dev-note="Knapsack React Template Wrapper"></div>
<script type="application/javascript">${code}</script>
    `;

    return {
      ok: true,
      html: KnapsackRendererWebpackBase.formatCode({
        code: html,
        language: 'html',
      }),
      usage,
      // usage: await this.babelTransform(demoAppUsage),
      // usage: html,
      templateLanguage: this.language,
    };
  }

  async render(
    opt: KnapsackRenderParams,
  ): Promise<KnapsackTemplateRendererResults> {
    if (KnapsackReactRenderer.isTemplateDemo(opt.demo)) {
      const id = `${opt.pattern.id}-${opt.template.id}-${opt.demo.id}`;

      const templateDemoPath = opt.patternManifest.getTemplateDemoAbsolutePath({
        patternId: opt.pattern.id,
        templateId: opt.template.id,
        demoId: opt.demo.id,
      });
      const usage = await readFile(templateDemoPath, 'utf-8');
      const exportName = opt.demo?.templateInfo?.alias || 'default';

      const ksImportCode = `const DemoApp = window.knapsack['${id}'].${exportName};`;

      const demoApp = `
${ksImportCode}
      `;
      const results = await this.prepClientRenderResults({
        usage,
        demoApp,
        webpackScriptSrcs: [this.getWebPackEntryPath(id)],
      });

      return results;
    }
    if (KnapsackReactRenderer.isDataDemo(opt.demo)) {
      const { usage, imports } = await this.getUsageAndImports(opt);

      const importCode = imports
        .map(({ isNamedImport, path, name }) => {
          return `import ${
            isNamedImport ? `{ ${name} }` : name
          } from '${path}';`;
        })
        .join('\n');

      const ksImportCode = imports
        .map(({ name, isNamedImport, templateId, patternId, demoId }) => {
          const exportName = isNamedImport ? name : 'default';
          return `const ${name} = window.knapsack['${patternId}-${templateId}${
            demoId ? `-${demoId}` : ''
          }'].${exportName};`;
        })
        .join('\n');

      const webpackScriptSrcs = imports.map(imp => {
        const id = `${imp.patternId}-${imp.templateId}`;
        return this.getWebPackEntryPath(id);
      });

      const formattedUsage = KnapsackRendererWebpackBase.formatCode({
        code: `${importCode}\n\n${usage}`,
        language: this.language,
      });

      const demoAppUsage = await getDemoAppUsage({
        children: usage,
        imports: importCode,
      });
      const demoApp = await getDemoAppUsage({
        children: usage,
        imports: ksImportCode,
      });

      return this.prepClientRenderResults({
        demoApp,
        usage: demoAppUsage,
        webpackScriptSrcs,
      });
    }
  }

  async getUsageAndImports(
    opt: KnapsackRenderParams,
  ): Promise<{
    usage: string;
    imports: ImportInfo[];
  }> {
    const { pattern, template, patternManifest, demo } = opt;
    if (demo?.type && KnapsackReactRenderer.isDataDemo(demo)) {
      const {
        data: { props, slots },
      } = demo;
      const isNamedImport = template.alias && template.alias !== 'default';
      const templateName = upperCamelCase(
        isNamedImport ? template.alias : pattern.id,
      );

      const importInfos: ImportInfo[] = [];
      const children: string[] = [];
      const extraProps: { key: string; value: string }[] = [];

      if (slots) {
        const slotNames = Object.keys(slots);
        await Promise.all(
          slotNames.map(async slotName => {
            const slotItems = slots[slotName];
            await Promise.all(
              slotItems.map(async slotItem => {
                if (KnapsackRendererBase.isSlottedText(slotItem)) {
                  children.push(slotItem);
                } else {
                  const slotPattern = patternManifest.getPattern(
                    slotItem.patternId,
                  );

                  const slotTemplate = slotPattern.templates.find(
                    t => t.id === slotItem.templateId,
                  );

                  const { usage, imports } = await this.getUsageAndImports({
                    pattern: slotPattern,
                    template: slotTemplate,
                    demo: slotTemplate?.demosById[slotItem.demoId],
                    patternManifest,
                  });

                  imports.forEach(i => importInfos.push(i));
                  if (slotName === 'children') {
                    children.push(usage);
                  } else {
                    extraProps.push({
                      key: slotName,
                      value: usage,
                    });
                  }
                }
              }),
            );
          }),
        );
      }

      const usage = await getUsage({
        templateName,
        props,
        children: children.join('\n'),
        extraProps,
      });

      const imports: ImportInfo[] = [];
      imports.push({
        isNamedImport,
        name: templateName,
        path: template.path,
        patternId: pattern.id,
        templateId: template.id,
      });
      importInfos.forEach(importInfo => {
        // make unique
        if (!imports.some(i => i.name === importInfo.name)) {
          imports.push(importInfo);
        }
      });

      return {
        usage,
        imports,
      };
    }

    return {
      usage: `Uh oh, don't know how to help`,
      imports: [],
    };
  }

  async getUsage(opt: KnapsackRenderParams): Promise<string> {
    const { usage } = await this.getUsageAndImports(opt);
    return usage;
  }
}
