import React from 'react';
import { TOKEN_CATS } from '../constants';
import { demoPropTypes } from './utils';
import { BordersDemoBox } from './styles';

export const BorderStyleDemo = ({ tokens }) => {
  if (!tokens) return null;
  return tokens.map(token => (
    <div key={token.name}>
      <h4>
        {token.name}
        <code>: {token.value}</code>
      </h4>
      {token.comment && <small>{token.comment}</small>}
      <BordersDemoBox
        style={{
          border: `1px ${token.value} black`,
        }}
      />
    </div>
  ));
};

BorderStyleDemo.tokenCategory = TOKEN_CATS.BORDER_STYLE;

BorderStyleDemo.propTypes = demoPropTypes;
