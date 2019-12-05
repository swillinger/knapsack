import React from 'react';
import { KnapsackDesignToken } from '@knapsack/core/dist/types';
import { CopyToClipboard } from '../copy-to-clipboard/copy-to-clipboard';
import './spacing.scss';

type Props = {
  tokens: KnapsackDesignToken[];
};

export const SpacingDemo: React.FC<Props> = ({ tokens }: Props) => {
  if (!tokens) return null;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '600px',
      }}
    >
      {tokens.map(token => (
        <div className="ks-spacing-swatch" key={token.name}>
          <span
            className="ks-spacing-swatch__spacing-outer"
            style={{
              height: token.value,
              width: token.value,
            }}
          />
          <div>
            {token.code && (
              <h6>
                <CopyToClipboard snippet={token.code} />
                <br />
                <CopyToClipboard snippet={token.value} />
                {token.comment && <small>{token.comment}</small>}
              </h6>
            )}
          </div>
          <div />
        </div>
      ))}
    </div>
  );
};
