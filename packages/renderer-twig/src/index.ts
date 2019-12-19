import { KnapsackRendererBase } from '@knapsack/app';
import {
  KnapsackRenderParams,
  KnapsackTemplateRenderer,
  KnapsackTemplateRendererResults,
} from '@knapsack/app/src/schemas/knapsack-config';
import TwigRenderer from '@basalt/twig-renderer';
import { readFile } from 'fs-extra';
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
  ): Promise<KnapsackTemplateRendererResults> {
    const usage = await this.getUsage(opt);
    const results = await this.twigRenderer.renderString(usage);
    return { ...results, usage, templateLanguage: this.language };
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
        const templateDemoPath = patternManifest.getTemplateDemoAbsolutePath({
          patternId: pattern.id,
          templateId: template.id,
          demoId: demo.id,
        });
        return readFile(templateDemoPath, 'utf-8');
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
                  if (KnapsackRendererBase.isSlottedText(slottedTemplate)) {
                    return `  ${slottedTemplate}`;
                  }
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

                  // indenting 2 spaces since it will be in a `{% set slotName %}` block
                  return usage
                    .split('\n')
                    .map(line => `  ${line}`)
                    .join('\n');
                }),
              );
            }),
          );

          const extraProps = [];
          const slotIncludes = Object.keys(slotProps).map(slotName => {
            extraProps.push({
              key: slotName,
              value: slotName,
            });
            const slotCodes = slotProps[slotName];
            return `
{% set ${slotName} %}
${slotCodes.join('\n\n')}
{% endset %}
      `.trim();
          });

          const usage = await getTwigUsage({
            templateName: template.alias,
            props,
            before: slotIncludes.join('\n\n'),
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
