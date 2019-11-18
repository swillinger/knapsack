import React from 'react';
import { KnapsackDesignToken } from '@knapsack/core';
import './text-shadow.scss';

type Props = {
  tokens: KnapsackDesignToken[];
};

export const TextShadowDemo: React.FC<Props> = ({ tokens }: Props) => {
  if (!tokens) return null;
  const demos = tokens.map(token => (
    <div className="ks-design-token-text-shadow-demo" key={token.name}>
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

  return <div>{demos}</div>;
};
