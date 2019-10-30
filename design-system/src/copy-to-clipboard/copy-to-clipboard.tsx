import React, { useState } from 'react';
import { CopyToClipboard as ReactCopyToClipboard } from 'react-copy-to-clipboard';

type Props = {
  snippet: string;
};

export const CopyToClipboard: React.FC<Props> = (props: Props) => {
  const { snippet } = props;
  const [hadCopied, setHasCopied] = useState(false);

  const codeStyle: React.CSSProperties = {
    transition: 'background-color ease-in-out .5s',
  };

  if (hadCopied) {
    codeStyle.backgroundColor = '#6ed300';
  }
  return (
    <span style={{ cursor: 'pointer' }}>
      <ReactCopyToClipboard
        text={snippet}
        onCopy={() => {
          setHasCopied(true);
          setTimeout(() => setHasCopied(false), 2000);
        }}
      >
        <code title="Click to copy" style={codeStyle}>
          {hadCopied ? 'Copied' : snippet}
        </code>
      </ReactCopyToClipboard>
    </span>
  );
};
