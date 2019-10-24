import React from 'react';
import CopyToClipboard from '@knapsack/copy-to-clipboard';
import { demoPropTypes } from './utils';
import './box-shadow.scss';

export const BoxShadowDemo = ({ tokens }) => {
  if (!tokens) return null;
  return tokens.map(token => (
    <div
      className="dtd-box-shadow"
      key={token.name}
      style={{
        boxShadow: token.value,
      }}
    >
      <h4>{token.name}</h4>
      {token.code && (
        <h6>
          <CopyToClipboard snippet={token.code} />
          <br />
          <CopyToClipboard snippet={token.value} />
        </h6>
      )}
      {token.comment && (
        <p>
          <small>{token.comment}</small>
        </p>
      )}
    </div>
  ));
};

BoxShadowDemo.propTypes = demoPropTypes;
