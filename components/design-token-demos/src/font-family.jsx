import React from 'react';
import { TOKEN_CATS } from '../constants';
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

FontFamilyDemo.tokenCategory = TOKEN_CATS.FONT_FAMILY;

FontFamilyDemo.propTypes = demoPropTypes;
