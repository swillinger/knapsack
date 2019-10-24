import React from 'react';
import { demoPropTypes } from './utils';
import TypographyChildrenDemoWrapper from './shared/typography-children-demo-wrapper';

export const FontFamilyDemo = ({ tokens }) => {
  if (!tokens) return null;
  return tokens.map(token => (
    <TypographyChildrenDemoWrapper key={token.name} fontFamily={token.value}>
      <code>{token.name}</code>: {token.value} <br />
      <blockquote contentEditable suppressContentEditableWarning>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </blockquote>
    </TypographyChildrenDemoWrapper>
  ));
};

FontFamilyDemo.propTypes = demoPropTypes;
