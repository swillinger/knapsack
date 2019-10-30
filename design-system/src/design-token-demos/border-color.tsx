import React from 'react';
import { KnapsackDesignToken } from '@knapsack/core';
import './shared/border-demo-box.scss';

type Props = {
  tokens: KnapsackDesignToken[];
};

export const BorderColorDemo: React.FC<Props> = ({ tokens }: Props) => {
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
          borderColor: token.value,
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      />
    </div>
  ));

  return <div>{demos}</div>;
};
