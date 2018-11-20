import React from 'react';
import ColorSwatches from '@basalt/bedrock-color-swatch';
import { TOKEN_CATS } from '../constants';
import { demoPropTypes } from './utils';

export const BackgroundColorDemo = ({ tokens }) => {
  if (!tokens) return null;
  return <ColorSwatches colors={tokens} />;
  // return tokens.map(token => (
  //   <div key={token.name}>
  //     <h4>
  //       {token.name}
  //       <code>: {token.value}</code>
  //     </h4>
  //     {token.comment && <small>{token.comment}</small>}
  //     <div
  //       style={{
  //         borderColor: token.value,
  //       }}
  //     />
  //   </div>
  // ));
};

BackgroundColorDemo.tokenCategory = TOKEN_CATS.BACKGROUND_COLOR;

BackgroundColorDemo.propTypes = demoPropTypes;
