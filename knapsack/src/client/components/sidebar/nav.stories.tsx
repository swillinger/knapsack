import React from 'react';
import { SecondaryNav } from './secondary-nav';

export default {
  title: 'Components|NavGroup',
  component: SecondaryNav,
  decorators: [],
  parameters: {},
};

const secondaryNavItems = [
  {
    id: 'patterns-asdf',
    name: 'Patterns',
    path: '/patterns',
    parentId: 'root',
  },
  {
    id: 'components-asdf',
    name: 'Components',
    path: '',
    parentId: 'patterns-asdf',
  },
  {
    id: '/pattern/button',
    name: 'Button',
    path: '/pattern/button',
    parentId: 'components-asdf',
  },
];

export const simple = () => (
  <SecondaryNav secondaryNavItems={secondaryNavItems} />
);
