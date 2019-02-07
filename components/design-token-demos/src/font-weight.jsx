import React from 'react';
import { demoPropTypes } from './utils';
import { TypographyChildrenDemoWrapper } from './styles';

export const FontWeightDemo = ({ tokens }) => {
  if (!tokens) return null;
  return tokens.map((token, index) => (
    <TypographyChildrenDemoWrapper
      key={token.name}
      index={index + 1}
      length={tokens.length}
      fontWeight={token.value}
    >
      <code>{token.name}</code>: {token.value} <br />
      <p suppressContentEditableWarning>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>
    </TypographyChildrenDemoWrapper>
  ));
};

FontWeightDemo.propTypes = demoPropTypes;
