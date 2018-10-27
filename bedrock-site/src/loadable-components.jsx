import Loadable from 'react-loadable';
import Spinner from '@basalt/bedrock-spinner';

export const LoadablePatternView = Loadable({
  loader: () =>
    import(/* webpackChunkName: "pattern-view-page" */ './pages/pattern-view-page'),
  loading: Spinner,
});

export const LoadableHome = Loadable({
  loader: () =>
    import(/* webpackChunkName: "home" */ './components/home-splash.jsx'),
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

export const LoadablePlayground = Loadable({
  loader: () =>
    import(/* webpackChunkName: "playground" */ './pages/playground'),
  loading: Spinner,
});

export const LoadableExamplesPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "about-page" */ './components/examples-guide'),
  loading: Spinner,
});

export const LoadableDesignTokenPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "design-token-page" */ './components/design-tokens-filterable-grid'),
  loading: Spinner,
});

export const LoadableAnimations = Loadable({
  loader: () =>
    import(/* webpackChunkName: "animations" */ './pages/design-tokens/transitions-demo'),
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
    import(/* webpackChunkName: "shadows-page" */ '@basalt/bedrock-shadows-demo'),
  loading: Spinner,
});

export const LoadableSpacings = Loadable({
  loader: () =>
    import(/* webpackChunkName: "spacings-page" */ './pages/design-tokens/spacings-page'),
  loading: Spinner,
});

export const LoadableTypography = Loadable({
  loader: () =>
    import(/* webpackChunkName: "typography" */ './pages/design-tokens/typography-page'),
  loading: Spinner,
});

export const LoadablePatternsPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "patterns-page" */ './components/patterns-filterable-grid'),
  loading: Spinner,
});

export const LoadableSidebar = Loadable({
  loader: () =>
    import(/* webpackChunkName: "sidebar" */ './components/sidebar'),
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
    import(/* webpackChunkName: "variation-demo" */ '@basalt/bedrock-variation-demo'),
  loading: Spinner,
});

export const LoadableDosAndDonts = Loadable({
  loader: () =>
    import(/* webpackChunkName: "dos-and-donts" */ '@basalt/bedrock-dos-and-donts'),
  loading: Spinner,
});

export const LoadableSettingsPage = Loadable({
  loader: () => import(/* webpackChunkName: "patterns-page" */ './settings'),
  loading: Spinner,
});

export const LoadableCustomSectionPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "custom-section-page" */ './pages/custom-section-page'),
  loading: Spinner,
});
