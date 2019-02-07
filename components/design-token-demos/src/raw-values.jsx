import React from 'react';
import { demoPropTypes } from './utils';

export const RawValuesDemo = ({ tokens }) => {
  if (!tokens) return null;
  return (
    <ul>
      {tokens.map(token => (
        <li key={token.name}>
          <strong>{token.name}</strong>
          <ul>
            <li>
              Value: <code>{token.value}</code>
            </li>
            {token.code && (
              <li>
                Code: <code>{token.code}</code>
              </li>
            )}
            {token.comment && <li>Comment: {token.comment}</li>}
          </ul>
        </li>
      ))}
    </ul>
  );
};

RawValuesDemo.propTypes = demoPropTypes;
