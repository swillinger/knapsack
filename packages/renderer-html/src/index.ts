import { KnapsackRendererBase } from '@knapsack/app';
import {
  KnapsackRenderParams,
  KnapsackTemplateRenderer,
  KnapsackTemplateRenderResults,
} from '@knapsack/app/src/schemas/knapsack-config';
import fs from 'fs-extra';

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
  ): Promise<KnapsackTemplateRenderResults> {
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
}

// @todo v3 - change to `export` - need to keep `module.exports` to preserve backwards compatibility
module.exports = KnapsackHtmlRenderer;
