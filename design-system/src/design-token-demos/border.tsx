import React from 'react';
import { KnapsackDesignToken } from '@knapsack/core/dist/types';
import './shared/border-demo-box.scss';

type Props = {
  tokens: KnapsackDesignToken[];
};

export const BorderDemo: React.FC<Props> = ({ tokens }: Props) => {
  if (!tokens) return null;
  const demos = tokens.map(token => (
    <div key={token.name}>
      <h4>
        {token.name}
        <code>: {token.value}</code>
      </h4>
      {token.comment && <small>{token.comment}</small>}
      <div
        className="ks-dtd-border-demo-box"
        style={{
          border: token.value,
        }}
      />
    </div>
  ));

  return <div>{demos}</div>;
};
