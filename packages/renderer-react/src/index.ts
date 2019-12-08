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
import { isDataDemo } from '@knapsack/app/dist/schemas/patterns';
import camelCase from 'camelcase';
import * as babel from '@babel/core';
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
    demoWrapperPath = join(__dirname, './demo-wrapper'),
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
      'error-catcher': join(__dirname, './error-catcher'),
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

  async render(
    opt: KnapsackRenderParams,
  ): Promise<KnapsackTemplateRendererResults> {
    const { usage, imports } = await this.getUsageAndImports(opt);
    const importCode = imports
      .map(({ isNamedImport, path, name }) => {
        return `import ${isNamedImport ? `{ ${name} }` : name} from '${path}';`;
      })
      .join('\n');
    const ksImportCode = imports
      .map(({ name, isNamedImport, templateId, patternId }) => {
        const exportName = isNamedImport ? name : 'default';
        return `const ${name} = window.knapsack['${patternId}-${templateId}'].${exportName};`;
      })
      .join('\n');
    const webpackScriptSrcs = imports.map(imp => {
      const id = `${imp.patternId}-${imp.templateId}.js`;
      const src = this.webpackManifest[id];
      if (!src) {
        const msg = `Error: cannot find "${id}" in webpack manifest: `;
        console.error(msg, this.webpackManifest);
        throw new Error(msg);
      }
      return src;
    });

    const formattedUsage = KnapsackRendererWebpackBase.formatCode({
      code: `${importCode}\n\n${usage}`,
      language: this.language,
    });
    const demoAppUsage = await getDemoAppUsage({
      children: usage,
      imports: ksImportCode,
    });
    const demoApp = await getDemoAppUsage({
      children: usage,
      imports: importCode,
    });
    // return {
    //   ok: true,
    //   html: `<h2>temp disabled</h2>`,
    //   usage,
    //   templateLanguage: this.language,
    // };
    const { pattern, template, patternManifest, demo } = opt;
    const exportName = template.alias || 'default';
    const props = demo && isDataDemo(demo) ? demo.data?.props : {};
    if (!this.webpackManifest) await this.setManifest();
    console.log(this.webpackManifest, demo);
    const id = `${pattern.id}-${template.id}`;
    let code = `
const root = document.getElementById('render-root');
const DemoWrapper = window.knapsack['demo-wrapper'].default;
const ErrorCatcher = window.knapsack['error-catcher'].default;

${demoAppUsage}

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
    <script>window.MY_REACT_DOCS = window.MY_REACT_DOCS || {}; </script>
${this.assets.map(asset => `<script src="${asset}"></script>`).join('')}
<script src="${this.webpackManifest['demo-wrapper.js']}"></script>
<script src="${this.webpackManifest['error-catcher.js']}"></script>
${webpackScriptSrcs
  .map(webpackScriptSrc => `<script src="${webpackScriptSrc}"></script>`)
  .join('')}
<div id="render-root" data-dev-note="Knapsack React Template Wrapper" data-id="${id}"></div>
<script type="application/javascript">${code}</script>
    `;

    return {
      ok: true,
      html: KnapsackRendererWebpackBase.formatCode({
        code: html,
        language: 'html',
      }),
      usage: demoApp,
      // usage: await this.babelTransform(demoAppUsage),
      // usage: html,
      templateLanguage: this.language,
    };
  }

  async getUsageAndImports(
    opt: KnapsackRenderParams,
  ): Promise<{
    usage: string;
    imports: ImportInfo[];
  }> {
    const { pattern, template, patternManifest, demo } = opt;
    if (demo?.type && isDataDemo(demo)) {
      const {
        data: { props, slots },
      } = demo;
      const isNamedImport = template.alias && template.alias !== 'default';
      const templateName = upperCamelCase(
        isNamedImport ? template.alias : pattern.id,
      );
      const childItems: Promise<{
        usage: string;
        imports?: ImportInfo[];
      }>[] = [];
      if (slots) {
        Object.keys(slots).forEach(slotName => {
          slots[slotName].forEach(slotItem => {
            if (KnapsackRendererBase.isSlottedText(slotItem)) {
              childItems.push(
                Promise.resolve({
                  usage: slotItem,
                }),
              );
            } else {
              const slotPattern = patternManifest.getPattern(
                slotItem.patternId,
              );

              const slotTemplate = slotPattern.templates.find(
                t => t.id === slotItem.templateId,
              );
              childItems.push(
                this.getUsageAndImports({
                  pattern: slotPattern,
                  template: slotTemplate,
                  demo: slotTemplate.demosById[slotItem.demoId],
                  patternManifest,
                }),
              );
            }
          });
        });
      }

      const kids = await Promise.all(childItems);

      const usage = await getUsage({
        templateName,
        props,
        children: kids.map(kid => kid.usage).join('\n'),
      });

      const imports: ImportInfo[] = [];
      imports.push({
        isNamedImport,
        name: templateName,
        path: template.path,
        patternId: pattern.id,
        templateId: template.id,
      });
      kids
        .filter(kid => kid.imports)
        .forEach(kid => {
          kid.imports.forEach(kidImport => {
            // make unique
            if (!imports.some(i => i.name === kidImport.name)) {
              imports.push(kidImport);
            }
          });
        });
      // const importsX = new Set<string>();
      // importsX.add(
      //   `import ${isNamedImport ? `{ ${templateName} }` : templateName} from '${
      //     template.path
      //   }';`,
      // );
      //
      // kids.forEach(kid => {
      //   kid.imports.forEach(i => importsX.add(i));
      // });
      //

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
    // const { pattern, template, patternManifest, demo } = opt;
    // if (isDataDemo(demo)) {
    //   const {
    //     data: { props, slots },
    //   } = demo;
    //   const templateName =
    //     template.alias && template.alias !== 'default'
    //       ? template.alias
    //       : pattern.id;
    //   const childItems: Promise<string>[] = [];
    //   if (slots) {
    //     Object.keys(slots).forEach(slotName => {
    //       slots[slotName].forEach(slotItem => {
    //         const slotPattern = patternManifest.getPattern(slotItem.patternId);
    //
    //         const slotTemplate = slotPattern.templates.find(
    //           t => t.id === slotItem.templateId,
    //         );
    //         childItems.push(
    //           this.getUsage({
    //             pattern: slotPattern,
    //             template: slotTemplate,
    //             demo: slotTemplate.demosById[slotItem.demoId],
    //             patternManifest,
    //           }),
    //         );
    //       });
    //     });
    //   }
    //
    //   return getUsage({
    //     templateName: upperCamelCase(templateName),
    //     props,
    //     children: await Promise.all(childItems).then(x => x.join('\n')),
    //   });
    // }
    //
    // return `Uh oh, don't know how to help`;
    // // @todo show how to `import` the React component
    //     return `
    // const data = ${JSON.stringify(data, null, '  ')};
    //
    // function Example() {
    //   return <${upperCamelCase(patternId)} {...data} />;
    // }
    //     `.trim();
  }
}
