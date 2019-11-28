import React from 'react';
import { SecondaryNav } from './secondary-nav';

export default {
  title: 'Components|NavGroup',
  component: SecondaryNav,
  decorators: [],
  parameters: {},
};

const treeItems = [
  {
    id: 'patterns-asdf',
    name: 'Patterns',
    path: '/patterns',
    parentId: 'root',
    children: [
      {
        id: 'components-asdf',
        name: 'Components',
        path: '',
        parentId: 'patterns-asdf',
        children: [
          {
            id: '/pattern/button',
            name: 'Button',
            path: '/pattern/button',
            parentId: 'components-asdf',
            expanded: true,
          },
        ],
        expanded: true,
      },
    ],
    expanded: true,
  },
  {
    id: 'design-tokens',
    name: 'Design Tokens',
    path: '',
    parentId: 'root',
    children: [
      {
        id: '/pattern/card',
        name: 'Card',
        path: '/pattern/card/',
        parentId: 'design-tokens',
        expanded: true,
      },
      {
        id: '/pages/colors',
        name: 'Colors',
        path: '/pages/colors',
        parentId: 'design-tokens',
        expanded: true,
      },
      {
        id: '/pages/breakpoints',
        name: 'Breakpoints',
        path: '/pages/breakpoints',
        parentId: 'design-tokens',
        expanded: true,
      },
      {
        id: '/pages/spacing',
        name: 'Spacing',
        path: '/pages/spacing',
        parentId: 'design-tokens',
        expanded: true,
      },
      {
        id: '/pages/animation',
        name: 'Animation',
        path: '/pages/animation',
        parentId: 'design-tokens',
        expanded: true,
      },
      {
        id: '/pages/shadows',
        name: 'Shadows',
        path: '/pages/shadows',
        parentId: 'design-tokens',
        expanded: true,
      },
    ],
    expanded: true,
  },
  {
    id: 'docs',
    name: 'Docs',
    path: '',
    parentId: 'root',
    children: [
      {
        id: '/pages/intro',
        name: 'Intro',
        path: '/pages/intro',
        parentId: 'docs',
        expanded: true,
      },
      {
        id: '/pages/accessibility',
        name: 'Accessibility',
        path: '/pages/accessibility',
        parentId: 'docs',
        expanded: true,
      },
    ],
    expanded: true,
  },
];

export const simple = () => <SecondaryNav treeItems={treeItems} canEdit />;
