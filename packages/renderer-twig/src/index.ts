import { KnapsackRendererBase } from '@knapsack/app';
import {
  KnapsackRenderParams,
  KnapsackTemplateRenderer,
  KnapsackTemplateRenderResults,
} from '@knapsack/app/src/schemas/knapsack-config';
import TwigRenderer from '@basalt/twig-renderer';
import { getTwigUsage } from './utils';

/* eslint-disable class-methods-use-this */

class KnapsackTwigRenderer extends KnapsackRendererBase
  implements KnapsackTemplateRenderer {
  twigRenderer: TwigRenderer;

  constructor(config) {
    super({
      id: 'twig',
      language: 'twig',
      extension: '.twig',
    });
    this.twigRenderer = new TwigRenderer({
      keepAlive: process.env.NODE_ENV === 'production',
      ...config,
    });
  }

  async render(
    opt: KnapsackRenderParams,
  ): Promise<KnapsackTemplateRenderResults> {
    const usage = await this.getUsage(opt);
    const results = await this.twigRenderer.renderString(usage);
    return results;
    // return this.twigRenderer.render(template.alias, data);
  }

  async getUsage(opt: KnapsackRenderParams): Promise<string> {
    const {
      pattern,
      template,
      demo,
      /**
       * The Patterns class
       */
      patternManifest,
    } = opt;
    if (!demo) {
      return `{% include "${template.alias}" only %}`;
    }
    switch (demo.type) {
      case 'template': {
        const { templateInfo } = demo;
        return getTwigUsage({
          templateName: templateInfo.alias,
          props: {},
        });
      }
      case 'data': {
        const {
          data: { props, slots },
        } = demo;
        if (!slots) {
          return getTwigUsage({
            templateName: template.alias,
            props,
          });
        }

        {
          const slotProps: {
            [slotName: string]: string[];
          } = {};
          await Promise.all(
            Object.keys(slots).map(async slotName => {
              const slottedTemplates = slots[slotName];
              slotProps[slotName] = await Promise.all(
                slottedTemplates.map(async slottedTemplate => {
                  const thisPattern = patternManifest.getPattern(
                    slottedTemplate.patternId,
                  );
                  const thisTemplate = thisPattern.templates.find(
                    t => t.id === slottedTemplate.templateId,
                  );

                  const usage = await this.getUsage({
                    pattern: thisPattern,
                    template: thisTemplate,
                    patternManifest,
                    demo: thisTemplate.demosById[slottedTemplate.demoId],
                  });

                  return usage;
                }),
              );
            }),
          );

          const extraProps = [];
          const slotIncludes = Object.keys(slotProps)
            .map(slotName => {
              extraProps.push({
                key: slotName,
                value: slotName,
              });
              const slotCodes = slotProps[slotName];
              return `
{% set ${slotName} %}
${slotCodes.join('\n\n')}
{% endset %}
      `;
            })
            .join('\n\n');

          const usage = await getTwigUsage({
            templateName: template.alias,
            props,
            before: slotIncludes,
            extraProps,
          });

          return usage;
        }
      }

      default:
        throw new Error(`Must pass in a demo.type`);
    }
  }
}

// @todo v3 - change to `export` - need to keep `module.exports` to preserve backwards compatibility
module.exports = KnapsackTwigRenderer;
