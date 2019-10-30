import React from 'react';
import { KnapsackDesignToken } from '@knapsack/core';
import '@basalt/knapsack/src/client/pages/design-tokens/shadows-page.scss';

type Props = {
  tokens: KnapsackDesignToken[];
};

export const TextShadowDemo: React.FC<Props> = ({ tokens }: Props) => {
  if (!tokens) return null;
  const demos = tokens.map(token => (
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

  return <div>{demos}</div>;
};
