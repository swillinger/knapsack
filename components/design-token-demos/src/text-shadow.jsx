import React from 'react';
import { demoPropTypes } from './utils';
import '@basalt/knapsack/src/client/pages/design-tokens/shadows-page.scss';

export const TextShadowDemo = ({ tokens }) => {
  if (!tokens) return null;
  return tokens.map(token => (
    <div className="shadow-page__demo-box" key={token.name}>
      <h4>{token.name}</h4>
      <p
        style={{
          textShadow: token.value,
        }}
      >
        Lorem Ipsum
      </p>
    </div>
  ));
};

TextShadowDemo.propTypes = demoPropTypes;
