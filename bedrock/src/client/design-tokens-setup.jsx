import React from 'react';
import { plugins } from '@basalt/bedrock-core';
import { TOKEN_GROUPS } from '../lib/constants';
import {
  LoadableShadows,
  LoadableBorders,
  LoadableColors,
  // LoadableTransitions,
  LoadableTypography,
  LoadableSizings,
} from './loadable-components';

plugins.register('design-tokens-groups', api => {// eslint-disable-line
  plugins.addDesignTokensGroupPage({
    ...TOKEN_GROUPS.SHADOWS,
    render: props => <LoadableShadows {...props} />,
  });

  plugins.addDesignTokensGroupPage({
    ...TOKEN_GROUPS.BORDERS,
    render: props => <LoadableBorders {...props} />,
  });

  plugins.addDesignTokensGroupPage({
    ...TOKEN_GROUPS.COLORS,
    render: props => <LoadableColors {...props} />,
  });

  // plugins.addDesignTokensGroupPage({
  //   ...TOKEN_GROUPS.ANIMATIONS,
  //   // @todo rename transitions => animations
  //   render: props => <LoadableTransitions {...props} />,
  // });

  plugins.addDesignTokensGroupPage({
    ...TOKEN_GROUPS.TYPOGRAPHY,
    render: props => <LoadableTypography {...props} />,
  });

  plugins.addDesignTokensGroupPage({
    ...TOKEN_GROUPS.SIZING,
    render: props => <LoadableSizings {...props} />,
  });
});
