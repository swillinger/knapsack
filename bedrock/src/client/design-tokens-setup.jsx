import React from 'react';
import { plugins } from '@basalt/bedrock-core';
import * as Demos from '@basalt/bedrock-design-token-demos';
// import {
//   LoadableShadows,
//   LoadableBorders,
//   LoadableColors,
//   // LoadableTransitions,
//   LoadableTypography,
//   LoadableSizings,
// } from './loadable-components';

plugins.register('design-tokens', api => {// eslint-disable-line
  Object.keys(Demos).forEach(DemoName => {
    const Demo = Demos[DemoName];
    if (Demo.tokenCategory) {
      plugins.addDesignTokenCategoryDemo({
        id: Demo.tokenCategory,
        render: props => <Demo {...props} />,
      });
    }
  });

  // plugins.addDesignTokensGroupPage({
  //   ...TOKEN_GROUPS.SHADOWS,
  //   render: props => <LoadableShadows {...props} />,
  // });
  //
  // plugins.addDesignTokensGroupPage({
  //   ...TOKEN_GROUPS.BORDERS,
  //   render: props => <LoadableBorders {...props} />,
  // });
  //
  // plugins.addDesignTokensGroupPage({
  //   ...TOKEN_GROUPS.COLORS,
  //   render: props => <LoadableColors {...props} />,
  // });
  //
  // // plugins.addDesignTokensGroupPage({
  // //   ...TOKEN_GROUPS.ANIMATIONS,
  // //   // @todo rename transitions => animations
  // //   render: props => <LoadableTransitions {...props} />,
  // // });
  //
  // plugins.addDesignTokensGroupPage({
  //   ...TOKEN_GROUPS.TYPOGRAPHY,
  //   render: props => <LoadableTypography {...props} />,
  // });
  //
  // plugins.addDesignTokensGroupPage({
  //   ...TOKEN_GROUPS.SIZING,
  //   render: props => <LoadableSizings {...props} />,
  // });
});
