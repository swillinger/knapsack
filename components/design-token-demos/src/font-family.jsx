import React from 'react';
import { demoPropTypes } from './utils';
import { TypographyChildrenDemoWrapper } from './styles';

export const FontFamilyDemo = ({ tokens }) => {
  if (!tokens) return null;
  return tokens.map((token, index) => (
    <TypographyChildrenDemoWrapper
      key={token.name}
      index={index + 1}
      length={tokens.length}
      fontFamily={token.value}
    >
      <code>{token.name}</code>: {token.value} <br />
      <blockquote contentEditable suppressContentEditableWarning>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </blockquote>
    </TypographyChildrenDemoWrapper>
  ));
};

FontFamilyDemo.propTypes = demoPropTypes;
