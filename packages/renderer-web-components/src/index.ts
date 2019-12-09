import { KnapsackRendererBase } from '@knapsack/app';
import {
  KnapsackRenderParams,
  KnapsackTemplateRenderer,
  KnapsackTemplateRendererResults,
} from '@knapsack/app/src/schemas/knapsack-config';
import { readFile } from 'fs-extra';
import { getUsage } from './utils';

/* eslint-disable class-methods-use-this */

export class KnapsackWebComponentRenderer extends KnapsackRendererBase
  implements KnapsackTemplateRenderer {
  constructor() {
    super({
      id: 'web-components',
      language: 'web-components',
      extension: '.js',
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
      return getUsage({
        templateName: template.alias,
      });
    }
    switch (demo.type) {
      case 'template': {
        const { templateInfo } = demo;
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
          return getUsage({
            templateName: template.alias,
            props,
          });
        }

        const children: string[] = [];
        await Promise.all(
          Object.keys(slots).map(async slotName => {
            const slottedTemplates = slots[slotName];
            await Promise.all(
              slottedTemplates.map(async slottedTemplate => {
                if (KnapsackRendererBase.isSlottedText(slottedTemplate)) {
                  return slottedTemplate;
                }
                if (
                  !slottedTemplate.patternId ||
                  !slottedTemplate.templateId ||
                  !slottedTemplate.demoId
                ) {
                  return '';
                }
                const thisPattern = patternManifest.getPattern(
                  slottedTemplate.patternId,
                );
                const thisTemplate = thisPattern.templates.find(
                  t => t.id === slottedTemplate.templateId,
                );
                if (!thisTemplate) {
                  throw new Error(
                    `Cannot find template id "${slottedTemplate.templateId}" in "${slottedTemplate.patternId}"`,
                  );
                }

                const usage = await this.getUsage({
                  pattern: thisPattern,
                  template: thisTemplate,
                  patternManifest,
                  demo: thisTemplate.demosById[slottedTemplate.demoId],
                });

                return usage;
              }),
            ).then(usages => {
              if (slotName === 'default') {
                children.push(usages.join('\n'));
              } else {
                children.push(
                  `<div slot="${slotName}">${usages.join('\n')}</div>`,
                );
              }
            });
          }),
        );

        const usage = await getUsage({
          templateName: template.alias,
          props,
          children: children.join('\n'),
        });

        return usage;
      }

      default:
        throw new Error(`Must pass in a demo.type`);
    }
  }
}
