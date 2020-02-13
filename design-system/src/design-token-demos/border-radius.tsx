import React from 'react';
import { KnapsackDesignToken } from '@knapsack/core/dist/types';
import { CopyToClipboard } from '../copy-to-clipboard/copy-to-clipboard';
import './shared/border-demo-box.scss';

type Props = {
  tokens: KnapsackDesignToken[];
};

export const BorderRadiusDemo: React.FC<Props> = ({ tokens }: Props) => {
  if (!tokens) return null;
  const demos = tokens.map(token => (
    <div key={token.name}>
      {token.code && (
        <h6>
          Code: <CopyToClipboard snippet={token.code} />
          <br />
          Value: <CopyToClipboard snippet={token.value} />
        </h6>
      )}
      {token.comment && (
        <p>
          <small>{token.comment}</small>
        </p>
      )}
      {token.comment && <small>{token.comment}</small>}
      <div
        className="ks-dtd-border-demo-box"
        style={{
          borderRadius: token.value,
          border: '1px solid black',
        }}
      />
    </div>
  ));
  return <div>{demos}</div>;
};
