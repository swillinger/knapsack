import React from 'react';
import { plugins } from '@basalt/bedrock-core';
import { LoadableShadows, LoadableBorders, LoadableColors, LoadableTransitions, LoadableTypography, LoadableSizings } from './loadable-components';


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

  plugins.addDesignTokensGroupPage({
    id: 'borders',
    title: 'Borders',
    description: 'Some borders',
    tokenCategories: ['border-color', 'border-style', 'border-radius'],
    render: props => <LoadableBorders {...props} />,
  });

  plugins.addDesignTokensGroupPage({
    id: 'colors',
    title: 'Colors',
    description: 'Some colors',
    tokenCategories: ['border-color', 'text-color', 'hr-color', 'background-color', 'background-gradient'],
    render: props => <LoadableColors {...props} />,
  });

  plugins.addDesignTokensGroupPage({
    id: 'transitions',
    title: 'Transitions',
    description: 'Some transitions',
    tokenCategories: ['animation'],
    render: props => <LoadableTransitions {...props} />,
  });

  plugins.addDesignTokensGroupPage({
    id: 'typography',
    title: 'Typography',
    description: 'Some typography',
    tokenCategories: ['font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'text-color', 'text-shadow'],
    render: props => <LoadableTypography {...props} />,
  });

  plugins.addDesignTokensGroupPage({
    id: 'sizings',
    title: 'Sizings',
    description: 'Some sizings',
    tokenCategories: ['spacing', 'font-size', 'media-query'],
    render: props => <LoadableSizings {...props} />,
  });
});
