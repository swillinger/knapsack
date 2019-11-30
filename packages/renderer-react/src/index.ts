import { KnapsackRendererWebpackBase } from '@knapsack/app';
import {
  KnapsackTemplateRenderer,
  KnapsackConfig,
  KnapsackTemplateRendererResults,
} from '@knapsack/app/src/schemas/knapsack-config';
import {
  KnapsackPattern,
  KnapsackPatternTemplate,
} from '@knapsack/app/src/schemas/patterns';
import camelCase from 'camelcase';
import { copyReactAssets } from './utils';

/* eslint-disable class-methods-use-this */

function upperCamelCase(str: string): string {
  const cased = camelCase(str);
  return cased.charAt(0).toUpperCase() + cased.slice(1);
}

export class KnapsackReactRenderer extends KnapsackRendererWebpackBase
  implements KnapsackTemplateRenderer {
  assets: string[];

  constructor({
    webpackConfig,
    webpack,
  }: {
    id: string;
    extension: string;
    webpackConfig: import('webpack').Configuration;
    webpack: typeof import('webpack');
  }) {
    super({
      id: 'react',
      extension: '.jsx',
      language: 'jsx',
      webpackConfig,
      webpack,
    });

    this.assets = [];
  }

  init({
    config,
    allPatterns,
  }: {
    config: KnapsackConfig;
    templatePaths: string[];
    allPatterns: KnapsackPattern[];
  }): void {
    super.init({ config, allPatterns });
    this.assets = copyReactAssets(this.distDirAbsolute, this.publicPath);
  }

  async render({
    pattern,
    template,
    data,
  }: {
    template: KnapsackPatternTemplate;
    pattern: KnapsackPattern;
    data?: object;
  }): Promise<KnapsackTemplateRendererResults> {
    if (!this.webpackManifest) await this.setManifest();
    const id = `${pattern.id}-${template.id}`;
    const html = `
${this.assets.map(asset => `<script src="${asset}"></script>`).join('')}
<script src="${this.webpackManifest[`${id}.js`]}"></script>
<div data-dev-note="Knapsack React Template Wrapper" data-id="${id}"></div>
<script>
// Selects the div right before this script tag
const root = document.currentScript.previousElementSibling;
document.addEventListener('DOMContentLoaded', () => {
  const Component = window.knapsack['${id}'].default;
  ReactDOM.render(
    React.createElement(
      Component,
      ${JSON.stringify(data)}
    ),
  root);
});
</script>
    `;

    return {
      ok: true,
      html,
    };
  }

  async getUsage({ patternId, data = {} }) {
    // @todo show how to `import` the React component
    return `
const data = ${JSON.stringify(data, null, '  ')};

function Example() {
  return <${upperCamelCase(patternId)} {...data} />;
}
    `.trim();
  }
}
