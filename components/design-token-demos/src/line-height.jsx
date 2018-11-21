import React from 'react';
import { TOKEN_CATS } from '../constants';
import { demoPropTypes } from './utils';
import { TypographyChildrenDemoWrapper } from './styles';

export const LineHeightDemo = ({ tokens }) => {
  if (!tokens) return null;
  return tokens.map((token, index) => (
    <TypographyChildrenDemoWrapper
      key={token.name}
      index={index + 1}
      length={tokens.length}
      lineHeight={token.value}
    >
      <code>{token.name}</code>: {token.value} <br />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur.
      </p>
      <br />
    </TypographyChildrenDemoWrapper>
  ));
};

LineHeightDemo.tokenCategory = TOKEN_CATS.LINE_HEIGHT;

LineHeightDemo.propTypes = demoPropTypes;
