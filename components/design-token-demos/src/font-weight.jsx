import React from 'react';
import { demoPropTypes } from './utils';
import TypographyChildrenDemoWrapper from './shared/typography-children-demo-wrapper';

export const FontWeightDemo = ({ tokens }) => {
  if (!tokens) return null;
  return tokens.map(token => (
    <TypographyChildrenDemoWrapper key={token.name} fontWeight={token.value}>
      <code>{token.name}</code>: {token.value} <br />
      <p suppressContentEditableWarning>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>
    </TypographyChildrenDemoWrapper>
  ));
};

FontWeightDemo.propTypes = demoPropTypes;
