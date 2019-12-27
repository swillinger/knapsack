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
import { plugins } from '@knapsack/core';
import { getStateFromLocalStorage } from './store/utils';
import { getInitialState } from './data';
// import { createCloudClientPlugin } from '../cloud/client-plugin';

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
      },
    };
  }

  const createStore = await import(
    /* webpackChunkName: "store" */ './store'
  ).then(mod => mod.createStore);

  const store = createStore(initialState);

  const createCloudClientPlugin = await import(
    /* webpackChunkName: "cloud-client-plugin" */ '../cloud/client-plugin'
  ).then(mod => mod.createCloudClientPlugin);

  plugins.register(createCloudClientPlugin({ store }));

  const App = await import(/* webpackChunkName: "app" */ './App').then(
    mod => mod.App,
  );

  mountEl.textContent = '';

  ReactDom.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app'),
  );
});
