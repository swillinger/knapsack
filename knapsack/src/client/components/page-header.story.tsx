import React from 'react';
import { PageHeader } from './page-header';

export default {
  title: 'Components|PageHeader',
  component: PageHeader,
  decorators: [],
  parameters: {},
};

export const simple = () => (
  <PageHeader section="Section Name" title="Page Title" />
);
