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
  LoadableCustomSectionPage,
  LoadableGraphiqlPage,
  LoadablePageBuilderLandingPage,
  LoadablePatternsPage,
  LoadablePageBuilder,
  LoadableSettingsPage,
  LoadableDesignTokenGroup,
  LoadablePatternEdit,
  LoadablePatternNew,
  LoadableHome,
  LoadableAllTokens,
  LoadableDocPage,
  LoadableBadRoute,
} from './loadable-components';
import { BASE_PATHS } from '../lib/constants';

const FeedbackPage = React.lazy(() =>
  import(/* webpackChunkName: "feedback-page" */ './pages/feedback'),
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {},
      sections: [],
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
      window
        .fetch(`${this.apiEndpoint}/sections`)
        .then(res => res.json())
        .then(sections => ({
          sections: sections.map(section => ({
            ...section,
            items: section.items.map(item => ({
              path: `/pages/${section.id}/${item.id}`,
              ...item,
            })),
          })),
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
        tokenGroups {
          id
          title
          path
        }
        patterns {
          id
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
                          {this.state.sections.map(section => (
                            <Route
                              key={section.id}
                              path={`${BASE_PATHS.CUSTOM_PAGES}/${
                                section.id
                              }/:id`}
                              render={({ match, ...rest }) => (
                                <LoadableCustomSectionPage
                                  {...rest}
                                  key={match.params.id}
                                  id={match.params.id}
                                  sectionId={section.id}
                                />
                              )}
                            />
                          ))}
                          <Route
                            path={BASE_PATHS.DESIGN_TOKENS}
                            exact
                            render={() => {
                              const [firstTokenGroup] = data.tokenGroups;
                              if (firstTokenGroup) {
                                return (
                                  <Redirect
                                    to={`${BASE_PATHS.DESIGN_TOKENS}/${
                                      firstTokenGroup.id
                                    }`}
                                  />
                                );
                              }
                              return (
                                <LoadableBadRoute
                                  title="No Design Tokens Found"
                                  subtitle="Not so fast"
                                  message="We're having trouble finding your design tokens. Make sure you've properly configured `bedrock.config.js` to point to your entry design token yaml file, and that you've properly defined your design tokens. See the documentation at getbedrock.com for more details."
                                />
                              );
                            }}
                          />
                          <Route
                            path={`${BASE_PATHS.DESIGN_TOKENS}/all`}
                            exact
                            render={props => <LoadableAllTokens {...props} />}
                          />
                          <Route
                            path={BASE_PATHS.PATTERNS}
                            exact
                            render={props => (
                              <LoadablePatternsPage {...props} />
                            )}
                          />
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
                            path={`${BASE_PATHS.DESIGN_TOKENS}/:id`}
                            render={({ match }) => (
                              <LoadableDesignTokenGroup
                                id={match.params.id}
                                key={match.params.id}
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
                          <Route
                            path={`${BASE_PATHS.PATTERN}/:id`}
                            render={({ match, ...rest }) => {
                              if (
                                data.patterns
                                  .map(pattern => pattern.id)
                                  .find(item => match.params.id === item)
                              ) {
                                return (
                                  <LoadablePatternView
                                    {...rest}
                                    id={match.params.id}
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
                            path="/feedback"
                            render={() => (
                              <React.Suspense fallback={<p>Loading...</p>}>
                                <FeedbackPage />
                              </React.Suspense>
                            )}
                          />
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
