import React from 'react';
import { demoPropTypes } from './utils';
import './shared/border-demo-box.scss';

export const BorderColorDemo = ({ tokens }) => {
  if (!tokens) return null;
  return tokens.map(token => (
    <div key={token.name}>
      <h4>
        {token.name}
        <code>: {token.value}</code>
      </h4>
      {token.comment && <small>{token.comment}</small>}
      <div
        className="dtd-border-demo-box"
        style={{
          borderColor: token.value,
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      />
    </div>
  ));
};

BorderColorDemo.propTypes = demoPropTypes;
