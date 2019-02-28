/**
 *  Copyright (C) 2018 Basalt
    This file is part of Bedrock.
    Bedrock is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Bedrock is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Bedrock; if not, see <https://www.gnu.org/licenses>.
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Spinner from '@basalt/bedrock-spinner';
import {
  BedrockContextProvider,
  baseContext,
  plugins,
} from '@basalt/bedrock-core';
import ApolloClient from 'apollo-boost';
import { ApolloProvider, Query } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import GlobalStyles from './globals/global-styles';
import ErrorCatcher from './utils/error-catcher';
import { apiUrlBase } from './data';
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
import { BASE_PATHS } from '../lib/constants';
import './style.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {},
      permissions: [],
      meta: {},
      ready: false,
    };
    this.apiEndpoint = `${apiUrlBase}`;
    this.apolloClient = new ApolloClient({
      // This ensures we don't have `__typename` appear everywhere in stored data ~ https://github.com/apollographql/apollo-client/issues/1913
      cache: new InMemoryCache({
        addTypename: false,
      }),
    });
  }

  async componentDidMount() {
    plugins.loadPlugins({
      sayHi: () => console.log('hi from plugin api'),
    });

    const results = await Promise.all([
      window
        .fetch(`${this.apiEndpoint}/settings`)
        .then(res => res.json())
        .then(settings => ({
          settings,
        })),
      window
        .fetch(`${this.apiEndpoint}/meta`)
        .then(res => res.json())
        .then(meta => ({
          meta,
        })),
      window
        .fetch(`${this.apiEndpoint}/permissions`)
        .then(res => res.json())
        .then(permissions => ({
          permissions,
        })),
    ]);

    const initialState = Object.assign({}, ...results);
    this.setState({
      ready: true,
      ...initialState,
    });
  }

  render() {
    if (!this.state.ready) {
      return <Spinner />;
    }

    const cruxContext = Object.assign({}, baseContext, {
      settings: this.state.settings,
      features: this.props.features,
      meta: this.state.meta,
      permissions: this.state.permissions,
      setSettings: newSettings => this.setState({ settings: newSettings }),
    });

    // @todo consider removing; we're not using it anymore
    const query = gql`
      {
        settings {
          customSections {
            id
            title
            pages {
              id
              title
            }
          }
        }
        patterns {
          id
          templates {
            id
          }
          meta {
            showAllTemplates
          }
        }
        docs {
          id
        }
      }
    `;

    return (
      <ErrorCatcher>
        <ApolloProvider client={this.apolloClient}>
          <Query query={query}>
            {({
              loading,
              error,
              // eslint-disable-next-line no-unused-vars
              data,
            }) => {
              if (loading) return <Spinner />;
              if (error) return <p>Error</p>;
              const {
                settings: { customSections },
              } = data;
              return (
                <BedrockContextProvider value={cruxContext}>
                  <ThemeProvider theme={cruxContext.theme}>
                    <>
                      <GlobalStyles />
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
                              <LoadablePageBuilder
                                id={match.params.id}
                                appContext={this.state}
                              />
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
                            render={() => (
                              <Redirect to={`${BASE_PATHS.PATTERNS}/all`} />
                            )}
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
                              <LoadablePatternsPage
                                type={match.params.type}
                                {...props}
                              />
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
                          {this.state.permissions.includes('write') && (
                            <Route
                              path="/new-pattern"
                              exact
                              render={props => (
                                <LoadablePatternNew {...props} />
                              )}
                            />
                          )}
                          <Route
                            path={`${BASE_PATHS.GRAPHIQL_PLAYGROUND}`}
                            exact
                            render={props => (
                              <LoadableGraphiqlPage {...props} />
                            )}
                          />
                          {this.state.permissions.includes('write') && (
                            <Route
                              path="/settings"
                              exact
                              render={props => (
                                <LoadableSettingsPage {...props} />
                              )}
                            />
                          )}

                          {this.state.permissions.includes('write') && (
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
                              const pattern = data.patterns.find(
                                p => match.params.id === p.id,
                              );
                              if (!pattern) {
                                return (
                                  <LoadableBadRoute
                                    title={`Pattern "${
                                      match.params.id
                                    }" was not found in the system`}
                                    subtitle="Hold your horses"
                                    message={`We're having trouble finding the pattern "${
                                      match.params.id
                                    }" you requested. Please double check your url and the pattern meta.`}
                                  />
                                );
                              }

                              const [firstTemplate] = pattern.templates;
                              if (!firstTemplate) {
                                return (
                                  <LoadableBadRoute
                                    title={`Pattern "${
                                      match.params.id
                                    }" was found, but it did not having any templates in the system`}
                                    subtitle="Hold your horses"
                                    message={`We're having trouble finding the pattern "${
                                      match.params.id
                                    }" you requested. Please double check your url and the pattern meta.`}
                                  />
                                );
                              }

                              if (pattern && firstTemplate) {
                                const templateId = pattern.meta.showAllTemplates
                                  ? 'all'
                                  : firstTemplate.id;
                                return (
                                  <Redirect
                                    to={`${BASE_PATHS.PATTERN}/${
                                      match.params.id
                                    }/${templateId}`}
                                  />
                                );
                              }
                            }}
                          />

                          <Route
                            path={`${BASE_PATHS.PATTERN}/:id/:templateId`}
                            render={({ match, ...rest }) => {
                              if (
                                data.patterns
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
                                  title={`Pattern "${
                                    match.params.id
                                  }" was not found in the system`}
                                  subtitle="Hold your horses"
                                  message={`We're having trouble finding the pattern "${
                                    match.params.id
                                  }" you requested. Please double check your url and the pattern meta.`}
                                />
                              );
                            }}
                          />
                          <Route
                            path="/changelog"
                            component={LoadableChangelogPage}
                          />
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
                  </ThemeProvider>
                </BedrockContextProvider>
              );
            }}
          </Query>
        </ApolloProvider>
      </ErrorCatcher>
    );
  }
}

App.propTypes = {
  features: PropTypes.object.isRequired, // eslint-disable-line
};

export default App;
