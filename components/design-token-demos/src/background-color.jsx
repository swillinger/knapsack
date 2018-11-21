import React from 'react';
import ColorSwatches from '@basalt/bedrock-color-swatch';
import { TOKEN_CATS } from '../constants';
import { demoPropTypes } from './utils';

export const BackgroundColorDemo = ({ tokens }) => {
  if (!tokens) return null;
  return <ColorSwatches colors={tokens} />;
};

BackgroundColorDemo.tokenCategory = TOKEN_CATS.BACKGROUND_COLOR;

BackgroundColorDemo.propTypes = demoPropTypes;
