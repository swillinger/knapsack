import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import Spinner from '@basalt/bedrock-spinner';
import {
  BedrockContextProvider,
  baseContext,
  plugins,
} from '@basalt/bedrock-core';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import GlobalStyles from './globals/global-styles';
import ErrorCatcher from './utils/error-catcher';
import { apiUrlBase } from './data';
import {
  LoadableHeader,
  LoadableFooter,
  LoadablePatternView,
  LoadableCustomSectionPage,
  LoadableExamplesPage,
  LoadablePatternsPage,
  LoadablePlayground,
  LoadableSecondaryNav,
  LoadableSettingsPage,
  LoadableSidebar,
  LoadablePatternEdit,
  LoadablePatternNew,
  LoadableHome,
  LoadableAllTokens,
} from './loadable-components';
import { hasItemsInItems } from '../lib/utils';

const Site = styled.div`
  display: flex;
  justify-content: center;
  min-height: calc(100vh - 140px);
  width: 100%;
  max-width: 100vw;
  @media (min-width: 1300px) {
    min-height: calc(100vh - 175px);
  }
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: ${props => props.theme.globals.spacing.l};
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      patterns: [],
      settings: {},
      designTokensPages: [],
      sections: [],
      meta: {},
      ready: false,
    };
    this.apiEndpoint = `${apiUrlBase}`;
    this.apolloClient = new ApolloClient();
    this.isDesignTokenAvailable = this.isDesignTokenAvailable.bind(this);
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
      window
        .fetch(`${this.apiEndpoint}/design-tokens`)
        .then(res => res.json())
        .then(designTokens => {
          /** @type {string[]} */
          const availableTokenCategories = designTokens.map(d => d.id);
          return {
            designTokensPages: plugins.designTokensPages.filter(d =>
              hasItemsInItems(d.tokenCategories, availableTokenCategories),
            ),
          };
        }),
    ]);

    const initialState = Object.assign({}, ...results);
    this.setState({
      ready: true,
      ...initialState,
    });
  }

  isDesignTokenAvailable(id) {
    return this.state.designTokens.some(t => t.id === id);
  }

  render() {
    if (!this.state.ready) {
      return <Spinner />;
    }

    const cruxContext = Object.assign({}, baseContext, {
      patterns: this.state.patterns,
      sections: this.state.sections,
      designTokensPages: this.state.designTokensPages,
      settings: this.state.settings,
      features: this.props.features,
      meta: this.state.meta,
      setSettings: newSettings => this.setState({ settings: newSettings }),
    });

    return (
      <ErrorCatcher>
        <ApolloProvider client={this.apolloClient}>
          <BedrockContextProvider value={cruxContext}>
            <ThemeProvider theme={cruxContext.theme}>
              <React.Fragment>
                <GlobalStyles />
                <Router>
                  <div>
                    <Route
                      path="/"
                      component={routeProps => (
                        <LoadableHeader {...routeProps} />
                      )}
                    />
                    <Site>
                      <Switch>
                        <Route path="/" exact />
                        <Route path="/examples/*" />
                        <Route
                          path="/"
                          render={({ location }) => (
                            <LoadableSidebar>
                              <LoadableSecondaryNav location={location} />
                            </LoadableSidebar>
                          )}
                        />
                      </Switch>
                      <MainContent>
                        <ErrorCatcher>
                          <Switch>
                            <Route
                              path="/"
                              exact
                              render={() => {
                                if (plugins.homePage) {
                                  return plugins.homePage.render();
                                }
                                return <LoadableHome />;
                              }}
                            />
                            <Route
                              path="/examples/:id"
                              render={({ match }) => (
                                <LoadablePlayground
                                  id={match.params.id}
                                  patterns={this.state.patterns}
                                />
                              )}
                            />
                            <Route
                              path="/examples"
                              component={LoadableExamplesPage}
                              exact
                            />
                            {this.state.sections.map(section => (
                              <Route
                                key={section.id}
                                path={`/pages/${section.id}/:id`}
                                render={({ match }) => (
                                  <LoadableCustomSectionPage
                                    key={match.params.id}
                                    id={match.params.id}
                                    sectionId={section.id}
                                  />
                                )}
                              />
                            ))}
                            <Route
                              path="/design-tokens"
                              component={LoadableAllTokens}
                              exact
                            />

                            {this.state.designTokensPages.map(page => {
                              const { render, ...rest } = page;
                              return (
                                <Route
                                  key={page.id}
                                  path={page.path}
                                  render={() =>
                                    render({
                                      ...rest,
                                    })
                                  }
                                />
                              );
                            })}

                            <Route
                              path="/design-tokens/all"
                              component={LoadableAllTokens}
                            />
                            <Route
                              path="/patterns"
                              component={LoadablePatternsPage}
                              exact
                            />
                            <Route
                              path="/patterns/:id/edit"
                              render={({ match }) => (
                                <LoadablePatternEdit
                                  id={match.params.id}
                                  key={match.params.id}
                                />
                              )}
                            />
                            <Route
                              path="/new-pattern"
                              component={LoadablePatternNew}
                            />
                            <Route
                              path="/settings"
                              component={LoadableSettingsPage}
                            />
                            <Route
                              path="/patterns/:id"
                              render={({ match }) => (
                                <LoadablePatternView
                                  id={match.params.id}
                                  size="m"
                                  key={match.params.id}
                                />
                              )}
                            />
                            <Redirect to="/" />
                          </Switch>
                        </ErrorCatcher>
                      </MainContent>
                    </Site>
                    <LoadableFooter />
                  </div>
                </Router>
              </React.Fragment>
            </ThemeProvider>
          </BedrockContextProvider>
        </ApolloProvider>
      </ErrorCatcher>
    );
  }
}

App.propTypes = {
  features: PropTypes.object.isRequired, // eslint-disable-line
};

export default App;
