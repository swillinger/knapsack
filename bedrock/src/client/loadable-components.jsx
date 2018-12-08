import Loadable from 'react-loadable';
import Spinner from '@basalt/bedrock-spinner';

export const LoadableHeader = Loadable({
  loader: () => import(/* webpackChunkName: "header" */ './components/header'),
  loading: Spinner,
});

export const LoadableFooter = Loadable({
  loader: () => import(/* webpackChunkName: "footer" */ './components/footer'),
  loading: Spinner,
});

export const LoadableDesignTokenGroup = Loadable({
  loader: () =>
    import(/* webpackChunkName: "design-token-group" */ './pages/design-tokens/design-token-group'),
  loading: Spinner,
});

export const LoadableDocPage = Loadable({
  loader: () => import(/* webpackChunkName: "doc-page" */ './pages/doc'),
  loading: Spinner,
});

export const LoadablePatternView = Loadable({
  loader: () =>
    import(/* webpackChunkName: "pattern-view-page" */ './pages/pattern-view-page'),
  loading: Spinner,
});

export const LoadableHome = Loadable({
  loader: () =>
    import(/* webpackChunkName: "home-splash" */ './components/home-splash'),
  loading: Spinner,
});

export const LoadablePatternEdit = Loadable({
  loader: () =>
    import(/* webpackChunkName: "pattern-edit-page" */ './pages/pattern-edit-page'),
  loading: Spinner,
});

export const LoadablePatternNew = Loadable({
  loader: () =>
    import(/* webpackChunkName: "pattern-new-page" */ './pages/pattern-new-page'),
  loading: Spinner,
});

export const LoadableGraphiqlPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "graphiql-page" */ './pages/graphiql-page'),
  loading: Spinner,
});

export const LoadablePageBuilder = Loadable({
  loader: () =>
    import(/* webpackChunkName: "page-builder" */ './pages/page-builder'),
  loading: Spinner,
});

export const LoadablePageBuilderLandingPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "page-builder-landing-page" */ './pages/page-builder-landing-page'),
  loading: Spinner,
});

export const LoadableTransitions = Loadable({
  loader: () =>
    import(/* webpackChunkName: "transitions-page" */ './pages/design-tokens/transitions-page'),
  loading: Spinner,
});

export const LoadableBreakpoints = Loadable({
  loader: () =>
    import(/* webpackChunkName: "breakpoints-page" */ './pages/design-tokens/breakpoints-page'),
  loading: Spinner,
});

export const LoadableColors = Loadable({
  loader: () =>
    import(/* webpackChunkName: "colors-page" */ './pages/design-tokens/colors-page'),
  loading: Spinner,
});

export const LoadableShadows = Loadable({
  loader: () =>
    import(/* webpackChunkName: "shadows-page" */ './pages/design-tokens/shadows-page'),
  loading: Spinner,
});

export const LoadableBorders = Loadable({
  loader: () =>
    import(/* webpackChunkName: "borders-page" */ './pages/design-tokens/borders-page'),
  loading: Spinner,
});

export const LoadableSizings = Loadable({
  loader: () =>
    import(/* webpackChunkName: "sizings-page" */ './pages/design-tokens/sizings-page'),
  loading: Spinner,
});

export const LoadableTypography = Loadable({
  loader: () =>
    import(/* webpackChunkName: "typography" */ './pages/design-tokens/typography-page'),
  loading: Spinner,
});

export const LoadablePatternsPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "patterns-page" */ './pages/patterns-filterable-grid-page'),
  loading: Spinner,
});

export const LoadableSecondaryNav = Loadable({
  loader: () =>
    import(/* webpackChunkName: "secondary-nav" */
    './components/secondary-nav'),
  loading: Spinner,
});

export const LoadableSchemaTable = Loadable({
  loader: () =>
    import(/* webpackChunkName: "schema-table" */ '@basalt/bedrock-schema-table'),
  loading: Spinner,
});

export const LoadableVariationDemo = Loadable({
  loader: () =>
    import(/* webpackChunkName: "variation-demo" */ './components/variation-demo'),
  loading: Spinner,
});

export const LoadableSettingsPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "patterns-page" */ './pages/settings'),
  loading: Spinner,
});

export const LoadableCustomSectionPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "custom-section-page" */ './pages/custom-section-page'),
  loading: Spinner,
});

export const LoadableAllTokens = Loadable({
  loader: () =>
    import(/* webpackChunkName: "all-tokens" */ './pages/design-tokens/all-page'),
  loading: Spinner,
});

export const LoadableBadRoute = Loadable({
  loader: () => import(/* webpackChunkName: "bad-route" */ './pages/bad-route'),
  loading: Spinner,
});
