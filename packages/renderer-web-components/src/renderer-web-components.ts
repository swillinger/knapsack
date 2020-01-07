import { KnapsackRendererBase } from '@knapsack/app';
import {
  KnapsackRenderParams,
  KnapsackTemplateRenderer,
  KnapsackTemplateRendererResults,
  KnapsackTemplateRendererBase,
} from '@knapsack/app/src/schemas/knapsack-config';
import { readFile, readFileSync } from 'fs-extra';
import {
  KnapsackFile,
  isOptionsProp,
  isBooleanProp,
  isStringProp,
  isNumberProp,
} from '@knapsack/core/types';
import {
  HTMLDataV1,
  IAttributeData,
} from 'vscode-html-languageservice/lib/esm/htmlLanguageTypes';
import { join } from 'path';
import { getUsage } from './utils';

const iconSvg = readFileSync(
  join(__dirname, '../web-components-logo.svg'),
  'utf-8',
);

/* eslint-disable class-methods-use-this */

export class KnapsackWebComponentRenderer extends KnapsackRendererBase
  implements KnapsackTemplateRenderer {
  constructor() {
    super({
      id: 'web-components',
      language: 'html',
      extension: '.html',
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
        return readFile(templateDemoPath, 'utf8');
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

  getMeta: KnapsackTemplateRenderer['getMeta'] = () => {
    return {
      id: this.id,
      title: 'Web Components',
      iconSvg,
      aliasUse: 'required',
      aliasTitle: 'Tag Name',
      aliasDescription:
        'The HTML tag, i.e. if you use `<my-card>` then `my-card`',
    };
  };

  getTemplateMeta: KnapsackTemplateRendererBase['getTemplateMeta'] = async ({
    pattern,
    template,
  }) => {
    const files: KnapsackFile[] = [];
    const htmlCustomData: HTMLDataV1 = {
      version: 1.1,
      tags: [],
    };
    if (template?.spec?.props) {
      const typeDefs = await KnapsackWebComponentRenderer.convertSchemaToTypeScriptDefs(
        {
          schema: template.spec.props,
          title: pattern.id,
          patternId: pattern.id,
          templateId: template.id,
        },
      );

      const attributes: IAttributeData[] = [];

      Object.entries(template.spec.props.properties).forEach(([name, meta]) => {
        const descriptions: string[] = [];
        const attr: IAttributeData = {
          name,
        };
        const isRequired =
          template.spec.props?.required?.includes(name) ?? false;
        if (isRequired) {
          descriptions.push('(required)');
        }
        if (isOptionsProp(meta)) {
          attr.values = meta.enum.map(option => ({
            name: option,
          }));
        } else if (isBooleanProp(meta)) {
          descriptions.push('boolean');
        }

        if (meta.description) descriptions.push(meta.description);
        attr.description = descriptions.join(' ');
        attributes.push(attr);
      });

      htmlCustomData.tags.push({
        name: template.alias,
        description: pattern.description ?? '',
        references: [
          {
            name: 'Knapsack Docs',
            // @todo pull in base url
            url: `http://localhost:3999/pattern/${pattern.id}/${template.id}`,
          },
        ],
        attributes,
      });

      files.push({
        contents: JSON.stringify(htmlCustomData, null, '  '),
        encoding: 'utf8',
        path: `${pattern.id}.${template.id}.html-data.json`,
      });
      files.push({
        contents: typeDefs,
        encoding: 'utf8',
        path: `${pattern.id}.${template.id}.spec.d.ts`,
      });
      files.push({
        contents: JSON.stringify(template.spec.props, null, '  '),
        encoding: 'utf8',
        path: `${pattern.id}.${template.id}.spec.json`,
      });
    }
    return files;
  };

  alterTemplateMetaFiles: KnapsackTemplateRendererBase['alterTemplateMetaFiles'] = async ({
    files,
  }) => {
    const newFiles: KnapsackFile[] = [];
    const htmlCustomData: HTMLDataV1 = {
      version: 1.1,
      tags: [],
    };

    files.forEach(file => {
      if (!file.path.endsWith('html-data.json')) {
        newFiles.push(file);
      } else {
        const data: HTMLDataV1 = JSON.parse(file.contents);
        data.tags.forEach(tag => htmlCustomData.tags.push(tag));
      }
    });

    newFiles.push({
      contents: JSON.stringify(htmlCustomData, null, '  '),
      encoding: 'utf8',
      path: `knapsack.html-data.json`,
    });
    return newFiles;
  };
}
