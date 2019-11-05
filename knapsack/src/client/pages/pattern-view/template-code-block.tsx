import React, { useEffect, useState } from 'react';
import { CodeBlock } from '@knapsack/design-system';
import gql from 'graphql-tag';
import { gqlQuery } from '../../data';

type Props = {
  patternId: string;
  templateId: string;
  data?: object;
};

const TemplateCodeBlock: React.FC<Props> = ({
  patternId,
  templateId,
  data = {},
}: Props) => {
  const codeBlockTabs = [
    {
      id: 'usage',
      name: 'Usage',
    },
    {
      id: 'data',
      name: 'Data',
    },
    {
      id: 'templateSrc',
      name: 'Template Source',
    },
    {
      id: 'html',
      name: 'HTML',
    },
  ];

  const [templateCode, setTemplateCode] = useState(null);

  useEffect(() => {
    gqlQuery({
      gqlQueryObj: gql`
        query TemplateCode(
          $patternId: String
          $templateId: String
          $data: JSON
        ) {
          templateCode(
            patternId: $patternId
            templateId: $templateId
            data: $data
          ) {
            language
            usage
            html
            templateSrc
          }
        }
      `,
      variables: {
        patternId,
        templateId,
        data,
      },
    }).then(({ data: gqlData, errors }) => {
      const { templateCode: newTemplateCode } = gqlData as {
        templateCode: {
          language: string;
          usage: string;
          html: string;
          templateSrc: string;
        };
      };
      setTemplateCode({
        ...newTemplateCode,
        data,
      });
      if (errors) {
        console.error(errors);
      }
    });
  }, [data, patternId, templateId]);

  if (!templateCode) return null;

  const items = codeBlockTabs
    .map(({ id, name }) => {
      let { language } = templateCode;
      let code = templateCode[id];
      if (id === 'data') {
        language = 'json';
        code =
          Object.keys(code).length > 0
            ? JSON.stringify(code, null, '  ')
            : null;
      } else if (id === 'html') {
        language = 'html';
      }
      return {
        id,
        name,
        code,
        language,
      };
    })
    .filter(tab => {
      if (!tab.code) return false;
      return true;
    });

  return (
    <div>
      <CodeBlock items={items} />
    </div>
  );
};

export default TemplateCodeBlock;
