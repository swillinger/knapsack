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
  LoadablePatternEdit,
  LoadablePatternNew,
  LoadableHome,
  LoadableDocPage,
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

  const { patterns, settings, meta, role } = useSelector(state => {
    return {
      settings: state.settingsState.settings,
      // grabbing just what we need in here so the whole App doesn't re-render any time other data inside `patterns` changes
      patterns: state.patternsState.patterns.map(
        ({ id, meta: patternMeta, templates }) => ({
          id,
          meta: {
            showAllTemplates: patternMeta.showAllTemplates,
          },
          templates: templates.map(template => ({
            id: template.id,
          })),
        }),
      ),
      meta: state.metaState.meta,
      role: state.userState.role,
    };
  });

  const { customSections } = settings;

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
                  path={`${BASE_PATHS.PAGES}/:id`}
                  render={({ match }) => (
                    <LoadablePageBuilder id={match.params.id} />
                  )}
                />
                <Route
                  path={BASE_PATHS.PAGES}
                  exact
                  render={props => (
                    <LoadablePageBuilderLandingPage {...props} />
                  )}
                />
                <Route
                  path={BASE_PATHS.PATTERNS}
                  exact
                  render={() => <Redirect to={`${BASE_PATHS.PATTERNS}/all`} />}
                />
                <Route
                  path={`${BASE_PATHS.PATTERNS}/all`}
                  exact
                  render={props => (
                    <LoadablePatternsPage type="all" {...props} />
                  )}
                />
                <Route
                  path={`${BASE_PATHS.PATTERNS}/:type`}
                  render={({ match, ...props }) => (
                    <LoadablePatternsPage type={match.params.type} {...props} />
                  )}
                />
                <Route
                  path={`${BASE_PATHS.DOCS}/:id`}
                  render={({ match }) => (
                    <LoadableDocPage
                      id={match.params.id}
                      key={match.params.id}
                    />
                  )}
                />
                {role.permissions.includes('write') && (
                  <Route
                    path="/new-pattern"
                    exact
                    render={props => <LoadablePatternNew {...props} />}
                  />
                )}
                <Route
                  path={`${BASE_PATHS.GRAPHIQL_PLAYGROUND}`}
                  exact
                  render={props => <LoadableGraphiqlPage {...props} />}
                />
                {role.permissions.includes('write') && (
                  <Route
                    path="/settings"
                    exact
                    render={props => <LoadableSettingsPage {...props} />}
                  />
                )}

                {role.permissions.includes('write') && (
                  <Route
                    path={`${BASE_PATHS.PATTERN}/:id/edit`}
                    render={({ match, ...rest }) => (
                      <LoadablePatternEdit
                        {...rest}
                        id={match.params.id}
                        key={match.params.id}
                      />
                    )}
                  />
                )}

                <Route
                  path={`${BASE_PATHS.PATTERN}/:id`}
                  exact
                  render={({ match }) => {
                    const pattern = patterns.find(
                      p => match.params.id === p.id,
                    );
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
                      const templateId = pattern.meta.showAllTemplates
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
                  render={({ match, ...rest }) => {
                    if (
                      patterns
                        .map(pattern => pattern.id)
                        .find(item => match.params.id === item)
                    ) {
                      return (
                        <LoadablePatternView
                          {...rest}
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
                {customSections &&
                  customSections.map(section =>
                    section.pages.map(page => {
                      const path = `/${section.id}/${page.id}`;
                      return (
                        <Route
                          key={path}
                          path={path}
                          render={() => (
                            <LoadableCustomPage
                              path={path}
                              sectionTitle={section.title}
                              sectionId={section.id}
                              title={page.title}
                              pageId={page.id}
                            />
                          )}
                        />
                      );
                    }),
                  )}
                <Route path="*" render={() => <LoadableBadRoute />} />
                <Redirect to="/" />
              </Switch>
            </Router>
          </>
        </KnapsackContextProvider>
      </ApolloProvider>
    </ErrorCatcher>
  );
};
