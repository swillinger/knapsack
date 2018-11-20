import React from 'react';
import { TOKEN_CATS } from '../constants';
import { demoPropTypes } from './utils';

export const HrColorDemo = ({ tokens }) => {
  if (!tokens) return null;
  return tokens.map(token => (
    <div key={token.name}>
      <h4>
        {token.name}
        <code>: {token.value}</code>
      </h4>
      {token.comment && <small>{token.comment}</small>}
      <hr
        style={{
          borderColor: token.value,
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      />
    </div>
  ));
};

HrColorDemo.tokenCategory = TOKEN_CATS.HR_COLOR;

HrColorDemo.propTypes = demoPropTypes;
