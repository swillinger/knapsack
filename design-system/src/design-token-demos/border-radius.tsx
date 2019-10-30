import React from 'react';
import { KnapsackDesignToken } from '@knapsack/core';
import './shared/border-demo-box.scss';

type Props = {
  tokens: KnapsackDesignToken[];
};

export const BorderRadiusDemo: React.FC<Props> = ({ tokens }: Props) => {
  if (!tokens) return null;
  const demos = tokens.map(token => (
    <div key={token.name}>
      <h4>
        {token.name}
        <code>: {token.value}</code>
      </h4>
      {token.comment && <small>{token.comment}</small>}
      <div
        className="dtd-border-demo-box"
        style={{
          borderRadius: token.value,
          border: '1px solid black',
        }}
      />
    </div>
  ));
  return <div>{demos}</div>;
};
