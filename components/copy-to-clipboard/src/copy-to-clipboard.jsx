import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard as ReactCopyToClipboard } from 'react-copy-to-clipboard';

function CopyToClipboard(props) {
  const { snippet } = props;
  const [hadCopied, setHasCopied] = useState(false);

  const codeStyle = {
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
}

CopyToClipboard.propTypes = {
  snippet: PropTypes.string.isRequired,
};

export default CopyToClipboard;
