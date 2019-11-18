import React from 'react';
import { KnapsackDesignToken } from '@knapsack/core';
import { CopyToClipboard } from '../copy-to-clipboard/copy-to-clipboard';
import './box-shadow.scss';

type Props = {
  tokens: KnapsackDesignToken[];
};

export const BoxShadowDemo: React.FC<Props> = ({ tokens }: Props) => {
  if (!tokens) return null;
  const demos = tokens.map(token => (
    <div
      className="ks-dtd-box-shadow"
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

  return <div>{demos}</div>;
};
