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
  LoadablePageBuilderLandingPage,
  LoadablePatternsPage,
  LoadablePageBuilder,
  LoadableSettingsPage,
  LoadableDesignTokenGroup,
  LoadablePatternEdit,
  LoadablePatternNew,
  LoadableHome,
  LoadableAllTokens,
} from './loadable-components';
import { BASE_PATHS } from '../lib/constants';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      patterns: [],
      settings: {},
      sections: [],
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
        .fetch(`${this.apiEndpoint}/patterns`)
        .then(res => res.json())
        .then(patterns => ({
          patterns,
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
      setSettings: newSettings => this.setState({ settings: newSettings }),
    });

    // @todo consider removing; we're not using it anymore
    const query = gql`
      {
        tokenGroups {
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
                            render={({ match, ...rest }) => (
                              <LoadablePageBuilder
                                {...rest}
                                id={match.params.id}
                                patterns={this.state.patterns}
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
                            render={props => <LoadableAllTokens {...props} />}
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
                          <Route
                            path={`${BASE_PATHS.PATTERNS}/:id/edit`}
                            render={({ match, ...rest }) => (
                              <LoadablePatternEdit
                                {...rest}
                                id={match.params.id}
                                key={match.params.id}
                              />
                            )}
                          />
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
                            path="/new-pattern"
                            exact
                            render={props => <LoadablePatternNew {...props} />}
                          />
                          <Route
                            path="/settings"
                            exact
                            render={props => (
                              <LoadableSettingsPage {...props} />
                            )}
                          />
                          <Route
                            path={`${BASE_PATHS.PATTERNS}/:id`}
                            render={({ match, ...rest }) => (
                              <LoadablePatternView
                                {...rest}
                                id={match.params.id}
                                size="m"
                                key={match.params.id}
                              />
                            )}
                          />
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
