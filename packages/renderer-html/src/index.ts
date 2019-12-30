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
    const { patternManifest, template, pattern } = opt;

    try {
      const templateAbsolutePath = patternManifest.getTemplateAbsolutePath({
        patternId: pattern.id,
        templateId: template.id,
      });
      return {
        ok: true,
        html: await fs.readFile(templateAbsolutePath, 'utf8'),
      };
    } catch (error) {
      return {
        ok: false,
        html: `<p>${error.message}<p>`,
        message: error.message,
      };
    }
  }

  async getUsage({ template }) {
    return fs.readFile(template.absolutePath, 'utf8');
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
