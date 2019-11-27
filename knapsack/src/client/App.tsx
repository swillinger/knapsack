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
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { plugins } from '@knapsack/core';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import HTML5Backend from 'react-dnd-html5-backend';
import { DndProvider, DndContext } from 'react-dnd';
import 'react-sortable-tree/style.css';
import { useSelector } from './store';
import { KnapsackContextProvider } from './context';
import ErrorCatcher from './utils/error-catcher';
import { BASE_PATHS } from '../lib/constants';
import {
  LoadablePatternView,
  LoadableGraphiqlPage,
  LoadablePageBuilderLandingPage,
  LoadablePatternsPage,
  LoadablePageBuilder,
  LoadableSettingsPage,
  LoadableCustomPage,
  LoadableHome,
  LoadableChangelogPage,
  LoadableBadRoute,
} from './loadable-components';
import './global/variables.css';
import './style.scss';

const apolloClient = new ApolloClient({
  // This ensures we don't have `__typename` appear everywhere in stored data ~ https://github.com/apollographql/apollo-client/issues/1913
  cache: new InMemoryCache({
    addTypename: false,
  }),
});

export const App: React.FC = () => {
  useEffect(() => {
    plugins.loadPlugins({
      sayHi: () => console.log('hi from plugin api'),
    });
  }, []);

  const settings = useSelector(s => s.settingsState.settings);
  const pages = useSelector(s => s.customPagesState.pages);
  const meta = useSelector(s => s.metaState.meta);
  const role = useSelector(s => s.userState.role);
  const patterns = useSelector(state => {
    // grabbing just what we need in here so the whole App doesn't re-render any time other data inside `patterns` changes
    return state.patternsState.patterns;
  });

  const knapsackContext = {
    settings,
    features: {}, // @todo remove
    meta,
    permissions: role.permissions,
  };

  return (
    <ErrorCatcher>
      <ApolloProvider client={apolloClient}>
        <KnapsackContextProvider value={knapsackContext}>
          <DndProvider backend={HTML5Backend}>
            <>
              <Router>
                <Switch>
                  <Route
                    path="/"
                    exact
                    render={props =>
                      plugins.homePage ? (
                        plugins.homePage.render()
                      ) : (
                        <LoadableHome {...props} />
                      )
                    }
                  />
                  <Route
                    path={`${BASE_PATHS.PAGE_BUILDER}/:id`}
                    render={({ match }) => (
                      <LoadablePageBuilder id={match.params.id} />
                    )}
                  />
                  <Route
                    path={BASE_PATHS.PAGE_BUILDER}
                    exact
                    render={props => (
                      <LoadablePageBuilderLandingPage {...props} />
                    )}
                  />

                  <Route
                    path={BASE_PATHS.PATTERNS}
                    exact
                    component={LoadablePatternsPage}
                  />

                  <Route
                    path={`${BASE_PATHS.GRAPHIQL_PLAYGROUND}`}
                    exact
                    render={props => <LoadableGraphiqlPage {...props} />}
                  />
                  {role.permissions.includes('write') && (
                    <Route
                      path={['/settings', '/settings/:kind']}
                      exact
                      render={({ match }) => (
                        <LoadableSettingsPage initialTab={match.params.kind} />
                      )}
                    />
                  )}

                  <Route
                    path={`${BASE_PATHS.PATTERN}/:id`}
                    exact
                    render={({ match }) => {
                      const pattern = patterns[match.params.id];
                      if (!pattern) {
                        return (
                          <LoadableBadRoute
                            title={`Pattern "${match.params.id}" was not found in the system`}
                            subtitle="Hold your horses"
                            message={`We're having trouble finding the pattern "${match.params.id}" you requested. Please double check your url and the pattern meta.`}
                          />
                        );
                      }

                      const [firstTemplate] = pattern.templates;
                      if (!firstTemplate) {
                        return (
                          <LoadableBadRoute
                            title={`Pattern "${match.params.id}" was found, but it did not having any templates in the system`}
                            subtitle="Hold your horses"
                            message={`We're having trouble finding the pattern "${match.params.id}" you requested. Please double check your url and the pattern meta.`}
                          />
                        );
                      }

                      if (pattern && firstTemplate) {
                        const templateId = pattern.showAllTemplates
                          ? 'all'
                          : firstTemplate.id;
                        return (
                          <Redirect
                            to={`${BASE_PATHS.PATTERN}/${match.params.id}/${templateId}`}
                          />
                        );
                      }
                    }}
                  />

                  <Route
                    path={`${BASE_PATHS.PATTERN}/:id/:templateId`}
                    exact
                    render={({ match, ...rest }) => {
                      if (patterns[match.params.id]) {
                        return (
                          <LoadablePatternView
                            patternId={match.params.id}
                            templateId={match.params.templateId}
                            size="m"
                            key={match.params.id}
                          />
                        );
                      }
                      return (
                        <LoadableBadRoute
                          title={`Pattern "${match.params.id}" was not found in the system`}
                          subtitle="Hold your horses"
                          message={`We're having trouble finding the pattern "${match.params.id}" you requested. Please double check your url and the pattern meta.`}
                        />
                      );
                    }}
                  />
                  <Route path="/changelog" component={LoadableChangelogPage} />
                  <Route
                    path={`${BASE_PATHS.PAGES}/:pageId`}
                    render={({
                      match: {
                        params: { pageId },
                      },
                    }) => {
                      const page = pages[pageId];
                      if (!page) {
                        return (
                          <LoadableBadRoute
                            title={`Page with id "${pageId}" was not found in the system`}
                            subtitle="Uh oh"
                            message={`Is it one of these? ${Object.keys(
                              pages,
                            ).join(', ')}`}
                          />
                        );
                      }
                      return (
                        <LoadableCustomPage
                          path={`${BASE_PATHS.PAGES}/${pageId}`}
                          key={`${BASE_PATHS.PAGES}/${pageId}`}
                          sectionTitle="Pages"
                          title={page.title}
                          pageId={pageId}
                        />
                      );
                    }}
                  />
                  <Route path="*" render={() => <LoadableBadRoute />} />
                  <Redirect to="/" />
                </Switch>
              </Router>
            </>
          </DndProvider>
        </KnapsackContextProvider>
      </ApolloProvider>
    </ErrorCatcher>
  );
};
