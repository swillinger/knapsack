import React from 'react';
import { TOKEN_CATS } from '../constants';
import { demoPropTypes } from './utils';
import { ShadowDemoBox } from './styles';

export const BoxShadowDemo = ({ tokens }) => {
  if (!tokens) return null;
  return tokens.map(token => (
    <ShadowDemoBox
      key={token.name}
      style={{
        boxShadow: token.value,
      }}
    >
      <h4>{token.name}</h4>
    </ShadowDemoBox>
  ));
};

BoxShadowDemo.tokenCategory = TOKEN_CATS.BOX_SHADOW;

BoxShadowDemo.propTypes = demoPropTypes;
