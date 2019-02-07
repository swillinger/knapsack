import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard as ReactCopyToClipboard } from 'react-copy-to-clipboard';
import { CopiedText } from './copy-to-clipboard.styles';

function CopyToClipboard(props) {
  const { snippet } = props;
  const [count, setCount] = useState(false);

  return (
    <span style={{ cursor: 'pointer' }}>
      <ReactCopyToClipboard
        text={snippet}
        onCopy={() => {
          setCount(true);
          setTimeout(() => setCount(false), 2000);
        }}
      >
        <code>{snippet}</code>
      </ReactCopyToClipboard>
      <CopiedText hasCopied={count}>Copied</CopiedText>
    </span>
  );
}

CopyToClipboard.propTypes = {
  snippet: PropTypes.string.isRequired,
};

export default CopyToClipboard;
