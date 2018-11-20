import React from 'react';
import { TOKEN_CATS } from '../constants';
import { demoPropTypes } from './utils';

export const TextShadowDemo = ({ tokens }) => {
  if (!tokens) return null;
  return tokens.map(token => (
    <div key={token.name}>
      <h4>
        {token.name}
        <code>: {token.value}</code>
      </h4>
      {token.comment && <small>{token.comment}</small>}
      <div
        style={{
          borderColor: token.value,
        }}
      />
    </div>
  ));
};

TextShadowDemo.tokenCategory = TOKEN_CATS.TEXT_SHADOW;

TextShadowDemo.propTypes = demoPropTypes;
