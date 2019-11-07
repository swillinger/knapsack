import React from 'react';
import { TabbedPanel } from '../tabbed-panel/tabbed-panel';
import { CodeSnippet } from './pretty-code/pretty-code';

export {
  availableLanguages,
  languageList,
  isLanguageSupported,
} from './pretty-code/pretty-code';

type Props = {
  items: {
    name: string;
    language?: string;
    id?: string;
    code: string;
  }[];
};

export const CodeBlock: React.FC<Props> = ({ items = [] }: Props) => {
  if (items.length === 0) {
    return null;
  }
  const tabs = items.map(({ name = '', language = '', code = '', id }) => ({
    title: name,
    id: id || `${name}-${language}-${code}`,
    children: (
      <CodeSnippet
        // role="textbox"
        // suppressContentEditableWarning
        // tabIndex={0}
        language={language}
        code={code}
      />
    ),
  }));

  return <TabbedPanel bleed="10px" items={tabs} />;
};
