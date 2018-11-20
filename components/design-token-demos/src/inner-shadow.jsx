import React from 'react';
import { TOKEN_CATS } from '../constants';
import { demoPropTypes } from './utils';
import { ShadowDemoBox } from './styles';

export const InnerShadowDemo = ({ tokens }) => {
  if (!tokens) return null;
  return tokens.map(token => (
    <ShadowDemoBox
      key={token.name}
      style={{
        innerShadow: token.value,
      }}
    >
      <h4>{token.name}</h4>
    </ShadowDemoBox>
  ));
};

InnerShadowDemo.tokenCategory = TOKEN_CATS.INNER_SHADOW;

InnerShadowDemo.propTypes = demoPropTypes;
