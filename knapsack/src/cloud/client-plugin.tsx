import React from 'react';
import {
  KsClientPlugin,
  KsPluginLoadFunc,
  KsPluginPageConfig,
  Navs,
} from '../schemas/plugins';

const createCloudClientPlugin: KsPluginLoadFunc<{}> = ({ store }) => {
  let state = store.getState();
  if (!state.metaState.meta.hasKnapsackCloud) return;

  const plugin: KsClientPlugin<{}> = {
    id: 'ks-cloud',
    addPages() {
      state = store.getState();
      const { canEdit, user } = state.userState;
      const username = user?.username;
      const pages: KsPluginPageConfig<{}>[] = [];

      if (canEdit) {
        pages.push({
          path: 'propose-change',
          title: 'Propose Change',
          navItem: {
            title: 'Propose Change',
            nav: Navs.primary,
          },
          Page: React.lazy(() => import('./propose-change-page')),
        });
      }

      pages.push({
        path: 'user',
        title: username || 'User',
        section: username ? 'User' : '',
        navItem: {
          title: 'User',
          nav: Navs.primarySub,
        },
        Page: React.lazy(() => import('./user-page')),
      });

      return pages;
    },
  };

  return plugin;
};

export default createCloudClientPlugin;
