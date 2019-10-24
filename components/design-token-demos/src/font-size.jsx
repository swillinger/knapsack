import React from 'react';
import { demoPropTypes } from './utils';
import './font-size.scss';

export const FontSizeDemo = ({ tokens }) => {
  if (!tokens) return null;
  return tokens.map((token, index) => (
    <div
      className={`dtd-font-size
        ${tokens.length !== index + 1 ? 'dtd-font-size--listed' : ''}`}
      key={token.name}
      style={{
        fontSize: token.value,
      }}
    >
      <code>{token.name}</code>: {token.value} <br />
      <blockquote contentEditable suppressContentEditableWarning>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </blockquote>
    </div>
  ));
};

FontSizeDemo.propTypes = demoPropTypes;
