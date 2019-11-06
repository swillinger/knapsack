import * as React from 'react';
import { PatternGrid } from './pattern-grid';

export default {
  title: 'Components|PatternGrid',
  component: PatternGrid,
  decorators: [],
  parameters: {},
};

const sampleData = {
  patterns: [
    {
      id: 'alert',
      title: 'Alert',
      description:
        'Provide contextual feedback messages for typical user actions with the handful of available and flexible alert messages.',
      typeId: 'atoms',
      statusId: 'ready',
    },
    {
      id: 'breadcrumb',
      title: 'Breadcrumb',
      description:
        'Indicate the current page’s location within a navigational hierarchy that automatically adds separators via CSS.',
      typeId: 'molecules',
      statusId: 'ready',
    },
    {
      id: 'button',
      title: 'Button',
      description:
        'Use Bootstrap’s custom button styles for actions in forms, dialogs, and more with support for multiple sizes, states, and more.',
      typeId: 'atoms',
      statusId: 'ready',
    },
    {
      id: 'card',
      title: 'Card',
      description:
        'Use Bootstrap’s custom card styles as a flexible and extensible content container. It includes options for headers and footers, a wide variety of content, contextual background colors, and powerful display options.',
      typeId: 'molecules',
      statusId: 'ready',
    },
    {
      id: 'card-grid',
      title: 'Card Grid',
      description: 'Display multiple cards in one responsive grid.',
      typeId: 'organisms',
      statusId: 'ready',
    },
    {
      id: 'jumbotron',
      title: 'Jumbotron',
      description:
        '\nA lightweight, flexible component that can optionally extend the entire viewport to showcase key marketing messages on your site.',
      typeId: 'molecules',
      statusId: 'ready',
    },
    {
      id: 'list-group',
      title: 'List Group',
      description:
        'Provide contextual feedback messages for typical user actions with the handful of available and flexible list-group messages.',
      typeId: 'molecules',
      statusId: 'ready',
    },
    {
      id: 'media-object',
      title: 'Media Object',
      description:
        'Use Bootstrap’s custom media-object to help build complex and repetitive components where some media is positioned alongside content that doesn’t wrap around said media. It does this with only two required classes thanks to flexbox.',
      typeId: 'molecules',
      statusId: 'ready',
    },
    {
      id: 'nav',
      title: 'NavBar',
      description: 'Indicate the current page’s location.',
      typeId: 'molecules',
      statusId: 'ready',
    },
    {
      id: 'table',
      title: 'Table',
      description: 'Display organized data.',
      typeId: 'layouts',
      statusId: 'ready',
    },
  ],
  patternStatuses: [
    {
      id: 'draft',
      title: 'Draft',
      color: '#9b9b9b',
    },
    {
      id: 'inProgress',
      title: 'In Progress',
      color: '#FC0',
    },
    {
      id: 'ready',
      title: 'Ready',
      color: '#2ECC40',
    },
  ],
  patternTypes: [
    {
      id: 'atoms',
      title: 'Atoms',
    },
    {
      id: 'molecules',
      title: 'Molecules',
    },
    {
      id: 'organisms',
      title: 'Organisms',
    },
    {
      id: 'layouts',
      title: 'Layouts',
    },
  ],
};

export const simple = () => <PatternGrid {...sampleData} />;
