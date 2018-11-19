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
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';
import GlobalStyles from './globals/global-styles';
import ErrorCatcher from './utils/error-catcher';
import { apiUrlBase } from './data';
import {
  LoadableHeader,
  LoadableFooter,
  LoadablePatternView,
  LoadableCustomSectionPage,
  LoadablePageBuilderLandingPage,
  LoadablePatternsPage,
  LoadablePageBuilder,
  LoadableSecondaryNav,
  LoadableSettingsPage,
  LoadableSidebar,
  LoadablePatternEdit,
  LoadablePatternNew,
  LoadableHome,
  LoadableAllTokens,
} from './loadable-components';
import { BASE_PATHS } from '../lib/constants';

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
      sections: [],
      meta: {},
      ready: false,
    };
    this.apiEndpoint = `${apiUrlBase}`;
    this.apolloClient = new ApolloClient();
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

    const query = gql`
      {
        tokenGroups {
          id
          title
          tokenCategories
          description
          path
        }
      }
    `;
    return (
      <ErrorCatcher>
        <ApolloProvider client={this.apolloClient}>
          <Query query={query}>
            {({ loading, error, data }) => {
              if (loading) return <Spinner />;
              if (error) return <p>Error</p>;

              const { tokenGroups = [] } = data;
              return (
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
                                      <LoadablePageBuilder
                                        id={match.params.id}
                                        patterns={this.state.patterns}
                                      />
                                    )}
                                  />
                                  <Route
                                    path="/examples"
                                    component={LoadablePageBuilderLandingPage}
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
                                    path={BASE_PATHS.DESIGN_TOKENS}
                                    component={LoadableAllTokens}
                                    exact
                                  />

                                  {tokenGroups.map(group => {
                                    const {
                                      render,
                                    } = plugins.designTokensGroupPages[
                                      group.id
                                    ];
                                    return (
                                      <Route
                                        key={group.id}
                                        path={group.path}
                                        render={() =>
                                          render({
                                            ...group,
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
                                    path={BASE_PATHS.PATTERNS}
                                    component={LoadablePatternsPage}
                                    exact
                                  />
                                  <Route
                                    path={`${BASE_PATHS.PATTERNS}/:id/edit`}
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
                                    path={`${BASE_PATHS.PATTERNS}/:id`}
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
