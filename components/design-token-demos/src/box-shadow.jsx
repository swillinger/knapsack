import React from 'react';
import { CopyToClipboardWrapper } from '@basalt/bedrock-color-swatch/src/color-swatch.styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { demoPropTypes } from './utils';
import { ShadowDemoBox } from './styles';

export const BoxShadowDemo = ({ tokens }) => {
  if (!tokens) return null;
  return tokens.map(token => (
    <ShadowDemoBox
      key={token.name}
      style={{
        boxShadow: token.value,
      }}
    >
      <h4>{token.name}</h4>
      {token.code && (
        <h6>
          <CopyToClipboardWrapper>
            <CopyToClipboard
              text={token.code}
              onCopy={() => window.alert(`"${token.code}" copied to clipboard`)} // @todo improve
            >
              <code>{token.code}</code>
            </CopyToClipboard>
          </CopyToClipboardWrapper>
          <br />
          <CopyToClipboardWrapper>
            <CopyToClipboard
              text={token.value}
              onCopy={() =>
                window.alert(`"${token.value}" copied to clipboard`)
              } // @todo improve
            >
              <code>{token.value}</code>
            </CopyToClipboard>
          </CopyToClipboardWrapper>
        </h6>
      )}
      {token.comment && (
        <p>
          <small>{token.comment}</small>
        </p>
      )}
    </ShadowDemoBox>
  ));
};

BoxShadowDemo.propTypes = demoPropTypes;
