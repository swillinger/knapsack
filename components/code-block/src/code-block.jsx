import React from 'react';
import PropTypes from 'prop-types';
import TabbedPanel from '@basalt/bedrock-tabbed-panel';
import PrettyCode from '@basalt/bedrock-pretty-code';

export {
  availableLanguages,
  languageList,
  isLanguageSupported,
} from '@basalt/bedrock-pretty-code';

const CodeBlock = ({ items = [] }) => {
  if (items.length === 0) {
    return null;
  }
  const tabs = items.map(({ name = '', language = '', code = '', id }) => ({
    title: name,
    id: id || `${name}-${language}-${code}`,
    children: (
      <PrettyCode
        role="textbox"
        suppressContentEditableWarning
        tabIndex={0}
        language={language}
        code={code}
      />
    ),
  }));

  return <TabbedPanel bleed="10px" color="component" items={tabs} />;
};

CodeBlock.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      language: PropTypes.string,
      code: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default CodeBlock;
