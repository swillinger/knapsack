import React from 'react';
import { TOKEN_CATS } from '../constants';
import { demoPropTypes } from './utils';
import { TypographyChildrenDemoWrapper } from './styles';

export const FontStyleDemo = ({ tokens }) => {
  if (!tokens) return null;
  return tokens.map((token, index) => (
    <TypographyChildrenDemoWrapper
      key={token.name}
      index={index + 1}
      length={tokens.length}
      fontStyle={token.value}
    >
      <code>{token.name}</code>: {token.value} <br />
      <p contentEditable suppressContentEditableWarning>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>
    </TypographyChildrenDemoWrapper>
  ));
};

FontStyleDemo.tokenCategory = TOKEN_CATS.FONT_STYLE;

FontStyleDemo.propTypes = demoPropTypes;
