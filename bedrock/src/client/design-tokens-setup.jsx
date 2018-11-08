import React from 'react';
import { plugins } from '@basalt/bedrock-core';
import { LoadableShadows } from './loadable-components';

plugins.register('design-tokens-groups', api => {
  // plugins.addDesignTokensGroupPage({
  //   id: 'colors',
  //   tokenCategories: [
  //     'border-color',
  //     'text-color',
  //     'hr-color',
  //     'background-color',
  //     'background-gradient',
  //   ],
  //   render: props => <LoadableColors {...props} />,
  // });

  plugins.addDesignTokensGroupPage({
    id: 'shadows',
    title: 'Shadows',
    description: 'Some shadows',
    tokenCategories: ['box-shadow', 'inner-shadow', 'text-shadow'],
    render: props => <LoadableShadows {...props} />,
  });
});
