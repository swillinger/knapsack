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
import Loadable from 'react-loadable';
// need to keep this entry point small, so not importing entire design system
import { Spinner } from '@knapsack/design-system/dist/spinner/spinner';

// @todo fix
/* eslint-disable import/no-cycle */
// export const LoadableCustomPage: typeof import('./pages/custom-page/custom-page').default = Loadable(
export const LoadableCustomPage = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "custom-slices-page" */ './pages/custom-page/custom-page'
    ),
  loading: Spinner,
});
/* eslint-enable import/no-cycle */

export const LoadableChangelogPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "changlog-page" */ './pages/changelog'),
  loading: Spinner,
});

// @todo fix
/* eslint-disable import/no-cycle */
export const LoadablePatternView = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "pattern-view-page" */ './pages/pattern-view/pattern-view-page'
    ),
  loading: Spinner,
});
/* eslint-enable import/no-cycle */

export const LoadableHome = Loadable({
  loader: () => import(/* webpackChunkName: "home-page" */ './pages/home-page'),
  loading: Spinner,
});

export const LoadableGraphiqlPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "graphiql-page" */ './pages/graphiql-page'),
  loading: Spinner,
});

export const LoadablePatternsPage = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "pattern-list-page" */ './pages/pattern-list-page'
    ).then(({ PatternListPage }) => PatternListPage),
  loading: Spinner,
});

export const LoadableSchemaTable = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "schema-table" */ '@knapsack/design-system/dist/schema-table/schema-table'
    ).then(mod => mod.SchemaTable),
  loading: Spinner,
});

export const LoadableVariationDemo = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "variation-demo" */ './components/variation-demo'
    ),
  loading: Spinner,
});

export const LoadableSettingsPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "patterns-page" */ './pages/settings'),
  loading: Spinner,
});

export const LoadableBadRoute = Loadable({
  loader: () => import(/* webpackChunkName: "bad-route" */ './pages/bad-route'),
  loading: Spinner,
});
