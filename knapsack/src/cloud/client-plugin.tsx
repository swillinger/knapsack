import Loadable from 'react-loadable';
import { Spinner } from '@knapsack/design-system/dist/spinner/spinner';
import React from 'react';
import { KsPlugin } from '@knapsack/core';

const LoadableUserPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "user-page" */ './user-page').then(
      ({ UserPage }) => UserPage,
    ),
  loading: Spinner,
});

export const LoadableProposeChange = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "propose-change-page" */ './propose-change-page'
    ).then(({ ProposeChangePage }) => ProposeChangePage),
  loading: Spinner,
});

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
          render: () => <LoadableProposeChange />,
        });
      }

      pages.push({
        path: 'user',
        title: username || 'User',
        section: username ? 'User' : '',
        navTitle: 'User',
        includeInPrimaryNav: true,
        render: () => <LoadableUserPage />,
      });

      return pages;
    },
  };

  return plugin;
}
