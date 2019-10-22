import { KnapsackRendererBase } from '@basalt/knapsack';
import {
  KnapsackTemplateRenderer,
  KnapsackTemplateRenderResults,
} from '@basalt/knapsack/src/schemas/knapsack-config';
import {
  KnapsackPatternTemplate,
  KnapsackPattern,
} from '@basalt/knapsack/src/schemas/patterns';
import TwigRenderer from '@basalt/twig-renderer';

/* eslint-disable class-methods-use-this */

class KnapsackTwigRenderer extends KnapsackRendererBase
  implements KnapsackTemplateRenderer {
  twigRenderer: TwigRenderer;

  constructor(config) {
    super({
      id: 'twig',
      extension: '.twig',
      language: 'twig',
    });
    this.twigRenderer = new TwigRenderer({
      keepAlive: process.env.NODE_ENV === 'production',
      ...config,
    });
  }

  async render({
    pattern,
    template,
    data,
  }: {
    template: KnapsackPatternTemplate;
    pattern: KnapsackPattern;
    data?: object;
  }): Promise<KnapsackTemplateRenderResults> {
    return this.twigRenderer.render(template.alias, data);
  }

  async getUsage({
    template,
    data = {},
  }: {
    patternId: string;
    template: KnapsackPatternTemplate;
    data?: Record<string, any>;
  }): Promise<string> {
    const { alias } = template;
    return `
{% include "${alias}" with ${JSON.stringify(data, null, '  ')} only %}
    `.trim();
  }
}

// @todo v3 - change to `export` - need to keep `module.exports` to preserve backwards compatibility
module.exports = KnapsackTwigRenderer;
