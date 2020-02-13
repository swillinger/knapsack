/**
 *  Copyright (C) 2018 Basalt
    This file is part of Knapsack.
    Knapsack is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Knapsack is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Knapsack; if not, see <https://www.gnu.org/licenses>.
 */
import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { CircleSpinner } from '@knapsack/design-system/spinners';
import { plugins } from './plugins';
import { KsClientPlugin, KsPluginLoadFunc } from '../types';
import { getStateFromLocalStorage } from './store/utils';
import { getInitialState } from './data';

const App = React.lazy(() => import('./App'));

document.addEventListener('DOMContentLoaded', async () => {
  const mountEl = document.createElement('div');
  mountEl.setAttribute('id', 'app');
  document.body.appendChild(mountEl);
  mountEl.textContent = 'Loading...';

  const cachedState = getStateFromLocalStorage();

  let initialState = await getInitialState();

  if (cachedState !== false) {
    // just restoring `ui` for now
    initialState = {
      ...initialState,
      ui: {
        ...initialState.ui,
        ...cachedState.ui,
        status: null,
      },
    };
  }

  const createStore = await import('./store').then(mod => mod.createStore);

  const store = createStore(initialState);

  const createCloudClientPlugin: KsPluginLoadFunc<{}> = await import(
    '../cloud/client-plugin'
  ).then(mod => mod.default);

  const { plugins: pluginMetas } = store.getState().metaState;

  const pluginRegisters: KsPluginLoadFunc<any>[] = await Promise.all(
    pluginMetas
      .filter(p => p.clientPluginPath)
      .map(async pluginMeta => {
        return import(
          /* webpackIgnore: true */
          pluginMeta.clientPluginPath
        )
          .then(mod => mod.default)
          .catch(e => {
            const msg = `Could not load plugin "${pluginMeta.id}" - trying to "import('${pluginMeta.clientPluginPath}')" `;
            console.error(e);
            console.error(msg);
            throw new Error(msg);
          });
      }),
  );

  [...pluginRegisters, createCloudClientPlugin].forEach(pluginRegister => {
    plugins.register(pluginRegister({ store }));
  });

  mountEl.textContent = '';

  ReactDom.render(
    <Provider store={store}>
      <React.Suspense fallback={<CircleSpinner />}>
        <App />
      </React.Suspense>
    </Provider>,
    document.getElementById('app'),
  );
});
