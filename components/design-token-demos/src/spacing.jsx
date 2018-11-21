import React from 'react';
import SpacingSwatches from '@basalt/bedrock-spacing-swatch';
import { TOKEN_CATS } from '../constants';
import { demoPropTypes } from './utils';

export const SpacingDemo = ({ tokens }) => {
  if (!tokens) return null;
  return <SpacingSwatches spaces={tokens} />;
};

SpacingDemo.tokenCategory = TOKEN_CATS.SPACING;

SpacingDemo.propTypes = demoPropTypes;
