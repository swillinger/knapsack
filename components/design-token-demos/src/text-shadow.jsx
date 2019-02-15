import React from 'react';
import { ShadowDemoBox } from '@basalt/bedrock/src/client/pages/design-tokens/shadows-page.styles';
import { demoPropTypes } from './utils';

export const TextShadowDemo = ({ tokens }) => {
  if (!tokens) return null;
  return tokens.map(token => (
    <ShadowDemoBox key={token.name}>
      <h4>{token.name}</h4>
      <p
        style={{
          textShadow: token.value,
        }}
      >
        Lorem Ipsum
      </p>
    </ShadowDemoBox>
  ));
};

TextShadowDemo.propTypes = demoPropTypes;
