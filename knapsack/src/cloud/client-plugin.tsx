import React from 'react';
import { KsPlugin } from '@knapsack/core';


export function createCloudClientPlugin({
  store,
}: {
  store: import('../client/store').StoreType;
}): KsPlugin {
  let state = store.getState();
  if (!state.metaState.meta.hasKnapsackCloud) return;

  const plugin: KsPlugin = {
    id: 'ks-cloud',
    addPages() {
      state = store.getState();
      const { canEdit, user } = state.userState;
      const username = user?.username;
      const pages: ReturnType<typeof plugin.addPages> = [];

      if (canEdit) {
        pages.push({
          path: 'propose-change',
          title: 'Propose Change',
          navTitle: 'Propose Change',
          includeInPrimaryNav: true,
          Page: React.lazy(() => import('./propose-change-page')),
        });
      }

      pages.push({
        path: 'user',
        title: username || 'User',
        section: username ? 'User' : '',
        navTitle: 'User',
        includeInPrimaryNav: true,
        Page: React.lazy(() => import('./user-page')),
      });

      return pages;
    },
  };

  return plugin;
}
