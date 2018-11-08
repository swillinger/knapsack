import React from 'react';
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
import merge from 'lodash.merge';
import GlobalStyles from './globals/global-styles';
import ErrorCatcher from './utils/error-catcher';
import Header from './components/header';
import Footer from './components/footer';
import {
  LoadableAnimations,
  LoadableBreakpoints,
  LoadableColors,
  LoadablePatternView,
  LoadableCustomSectionPage,
  LoadableDesignTokenPage,
  LoadableExamplesPage,
  LoadablePatternsPage,
  LoadablePlayground,
  LoadableSecondaryNav,
  LoadableSettingsPage,
  LoadableShadows,
  LoadableSidebar,
  LoadableSpacings,
  LoadableTypography,
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
      settings: props.bedrockSettings,
      /** @type {DesignTokensPage[]} */
      designTokensPages: [],
      sections: [],
      ready: false,
    };
    this.apiEndpoint = `${props.bedrockSettings.urls.apiUrlBase}`;
    this.isDesignTokenAvailable = this.isDesignTokenAvailable.bind(this);
  }

  async componentDidMount() {
    plugins.loadPlugins({
      sayHi: () => console.log('hi from plugin api'),
    });

    const results = await Promise.all([
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

    // Just a demo of how to override
    const cruxContext = merge({}, baseContext, {
      theme: this.state.settings.theme,
      patterns: this.state.patterns,
      sections: this.state.sections,
      designTokensPages: this.state.designTokensPages,
      settings: this.state.settings,
      setSettings: newSettings => this.setState({ settings: newSettings }),
    });

    return (
      <ErrorCatcher>
        <BedrockContextProvider value={cruxContext}>
          <ThemeProvider theme={cruxContext.theme}>
            <React.Fragment>
              <GlobalStyles />
              <Router>
                <div>
                  <Route
                    path="/"
                    component={routeProps => <Header {...routeProps} />}
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
                            component={LoadableDesignTokenPage}
                            exact
                          />

                          {this.state.designTokensPages.map(page => {
                            const {
                              render,
                              tokenCategories,
                              id,
                              description,
                              path,
                            } = page;
                            return (
                              <Route
                                key={id}
                                path={path}
                                render={() =>
                                  render({
                                    id,
                                    description,
                                    tokenCategories,
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
                          <Route
                            path="/resources/:id"
                            render={({ match }) => {
                              const Component = [match.id];
                              return <Component />;
                            }}
                          />
                          <Redirect to="/" />
                        </Switch>
                      </ErrorCatcher>
                    </MainContent>
                  </Site>
                  <Footer />
                </div>
              </Router>
            </React.Fragment>
          </ThemeProvider>
        </BedrockContextProvider>
      </ErrorCatcher>
    );
  }
}

App.propTypes = {
  bedrockSettings: PropTypes.object.isRequired, // eslint-disable-line
};

export default App;
