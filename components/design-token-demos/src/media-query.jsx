import React from 'react';
import BreakpointsDemo from '@basalt/bedrock-breakpoints-demo';
import { TOKEN_CATS } from '../constants';
import { demoPropTypes } from './utils';

export const MediaQueryDemo = ({ tokens }) => {
  if (!tokens) return null;
  return <BreakpointsDemo breakpoints={tokens} />;
};

MediaQueryDemo.tokenCategory = TOKEN_CATS.MEDIA_QUERY;

MediaQueryDemo.propTypes = demoPropTypes;
