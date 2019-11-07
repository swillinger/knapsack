import React from 'react';
import { NavList, Props } from './nav-list';

export default {
  title: 'Components|NavList',
  component: NavList,
  decorators: [],
  parameters: {},
};

const sampleNavProps: Props = {
  items: [
    {
      title: 'Patterns',
      id: 'patterns',
      path: '/patterns/all',
      isHeading: true,
    },
    {
      id: 'atoms',
      title: 'Atoms',
      isSubHeading: true,
      path: '/patterns/atoms',
    },
    {
      id: 'alert',
      status: {
        id: 'ready',
        title: 'Ready',
        color: '#2ECC40',
      },
      title: 'Alert',
      path: '/pattern/alert',
    },
    {
      id: 'button',
      status: {
        id: 'ready',
        title: 'Ready',
        color: '#2ECC40',
      },
      title: 'Button',
      path: '/pattern/button',
    },
    {
      id: 'molecules',
      title: 'Molecules',
      isSubHeading: true,
      path: '/patterns/molecules',
    },
    {
      id: 'breadcrumb',
      status: {
        id: 'ready',
        title: 'Ready',
        color: '#2ECC40',
      },
      title: 'Breadcrumb',
      path: '/pattern/breadcrumb',
    },
    {
      id: 'card',
      status: {
        id: 'ready',
        title: 'Ready',
        color: '#2ECC40',
      },
      title: 'Card',
      path: '/pattern/card',
    },
    {
      id: 'jumbotron',
      status: {
        id: 'ready',
        title: 'Ready',
        color: '#2ECC40',
      },
      title: 'Jumbotron',
      path: '/pattern/jumbotron',
    },
    {
      id: 'list-group',
      status: {
        id: 'ready',
        title: 'Ready',
        color: '#2ECC40',
      },
      title: 'List Group',
      path: '/pattern/list-group',
    },
    {
      id: 'media-object',
      status: {
        id: 'ready',
        title: 'Ready',
        color: '#2ECC40',
      },
      title: 'Media Object',
      path: '/pattern/media-object',
    },
    {
      id: 'nav',
      status: {
        id: 'ready',
        title: 'Ready',
        color: '#2ECC40',
      },
      title: 'NavBar',
      path: '/pattern/nav',
    },
    {
      id: 'organisms',
      title: 'Organisms',
      isSubHeading: true,
      path: '/patterns/organisms',
    },
    {
      id: 'card-grid',
      status: {
        id: 'ready',
        title: 'Ready',
        color: '#2ECC40',
      },
      title: 'Card Grid',
      path: '/pattern/card-grid',
    },
    {
      id: 'layouts',
      title: 'Layouts',
      isSubHeading: true,
      path: '/patterns/layouts',
    },
    {
      id: 'table',
      status: {
        id: 'ready',
        title: 'Ready',
        color: '#2ECC40',
      },
      title: 'Table',
      path: '/pattern/table',
    },
    {
      title: 'Page Builder',
      id: 'page-builder',
      isHeading: true,
      path: '/pages',
    },
    {
      id: 'Wc-p5CAcx',
      title: 'Simple Example',
      path: '/pages/Wc-p5CAcx',
    },
    {
      id: 'ajyFgFaT9',
      title: 'Another Page Example',
      path: '/pages/ajyFgFaT9',
    },
    {
      id: 'pauBMWCPr',
      title: 'A Third Example',
      path: '/pages/pauBMWCPr',
    },
    {
      id: 'AtFSAyWd',
      title: 'My New Example',
      path: '/pages/AtFSAyWd',
    },
    {
      title: 'Design Tokens',
      id: 'design-tokens',
      isHeading: true,
    },
    {
      id: 'animation',
      title: 'Animation',
      path: '/design-tokens/animation',
    },
    {
      id: 'colors',
      title: 'Colors',
      path: '/design-tokens/colors',
    },
    {
      id: 'breakpoint',
      title: 'Breakpoints',
      path: '/design-tokens/breakpoint',
    },
    {
      id: 'spacing',
      title: 'Spacing',
      path: '/design-tokens/spacing',
    },
    {
      id: 'shadows',
      title: 'Shadows',
      path: '/design-tokens/shadows',
    },
    {
      title: 'Docs',
      id: 'documentation',
      isHeading: true,
    },
    {
      id: 'intro',
      title: 'Introduction',
      path: '/documentation/intro',
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      path: '/documentation/accessibility',
    },
    {
      title: 'API',
      id: 'graphiql',
      isHeading: true,
      path: '/graphql-playground',
    },
  ],
};

export const simple = () => <NavList {...sampleNavProps} />;
