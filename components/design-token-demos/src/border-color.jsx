import React from 'react';
import { TOKEN_CATS } from '../constants';
import { demoPropTypes } from './utils';
import { BordersDemoBox } from './styles';

export const BorderColorDemo = ({ tokens }) => {
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
          borderColor: token.value,
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      />
    </div>
  ));
};

BorderColorDemo.tokenCategory = TOKEN_CATS.BORDER_COLOR;

BorderColorDemo.propTypes = demoPropTypes;
