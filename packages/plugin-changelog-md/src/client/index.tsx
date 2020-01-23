import React from 'react';
import { KsPluginLoadFunc } from '@knapsack/app/types';
import { Content } from '../types';

const createChangelogPlugin: KsPluginLoadFunc<Content> = ({ store }) => {
  return {
    id: 'changelog-md',
    addPages() {
      return [
        {
          path: 'changelog',
          navItem: {
            title: 'Changelog',
            nav: 'primarySub',
          },
          Page: React.lazy(() => import('./changelog-page')),
        },
      ];
    },
  };
};

export default createChangelogPlugin;
