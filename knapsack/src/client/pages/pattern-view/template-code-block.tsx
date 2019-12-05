import React from 'react';
import { CodeBlock } from '@knapsack/design-system';
import { KsRenderResults } from '../../../schemas/knapsack-config';

type Props = {
  templateInfo: KsRenderResults & { url: string };
};

const TemplateCodeBlock: React.FC<Props> = ({ templateInfo }: Props) => {
  if (!templateInfo) return null;

  const { templateLanguage, usage, html } = templateInfo;

  const codeBlockTabs = [
    usage
      ? {
          id: 'usage',
          name: 'Usage',
          code: usage,
          language: templateLanguage,
        }
      : null,
    // {
    //   id: 'templateSrc',
    //   name: 'Template Source',
    // },
    html
      ? {
          id: 'html',
          name: 'HTML',
          language: 'html',
          code: html,
        }
      : null,
  ].filter(Boolean);

  return (
    <div>
      <CodeBlock items={codeBlockTabs} />
    </div>
  );
};

export default TemplateCodeBlock;
