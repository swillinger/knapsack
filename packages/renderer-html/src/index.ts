import { KnapsackRendererBase } from '@knapsack/app';
import {
  KnapsackRenderParams,
  KnapsackTemplateRenderer,
  KnapsackTemplateRendererResults,
} from '@knapsack/app/src/schemas/knapsack-config';
import fs from 'fs-extra';
import { join } from 'path';

const iconSvg = fs.readFileSync(join(__dirname, '../html-logo.svg'), 'utf8');

/* eslint-disable class-methods-use-this */

class KnapsackHtmlRenderer extends KnapsackRendererBase
  implements KnapsackTemplateRenderer {
  constructor() {
    super({
      id: 'html',
      extension: '.html',
      language: 'html',
    });
  }

  async render(
    opt: KnapsackRenderParams,
  ): Promise<KnapsackTemplateRendererResults> {
    const usage = await this.getUsage(opt);

    return {
      ok: true,
      html: KnapsackRendererBase.formatCode({
        code: usage,
        language: 'html',
      }),
    };
  }

  async getUsage({
    pattern,
    template,
    demo,
    patternManifest,
  }: KnapsackRenderParams): Promise<string> {
    if (!demo) {
      return fs.readFile(template.alias, 'utf8');
    }
    if (KnapsackRendererBase.isTemplateDemo(demo)) {
      const templateDemoPath = patternManifest.getTemplateDemoAbsolutePath({
        patternId: pattern.id,
        templateId: template.id,
        demoId: demo.id,
      });
      return fs.readFile(templateDemoPath, 'utf8');
    }
  }

  getMeta: KnapsackTemplateRenderer['getMeta'] = () => {
    return {
      id: this.id,
      title: 'HTML',
      iconSvg,
      syntaxHighlightingLanguage: 'html',
      aliasUse: 'off',
    };
  };
}

// @todo v3 - change to `export` - need to keep `module.exports` to preserve backwards compatibility
module.exports = KnapsackHtmlRenderer;
