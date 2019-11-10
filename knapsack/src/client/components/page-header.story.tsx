import React from 'react';
import { PageHeader } from './page-header';

export default {
  title: 'App|PageHeader',
  component: PageHeader,
  decorators: [],
  parameters: {},
};

export const simple = () => (
  <PageHeader section="Section Name" title="Page Title" />
);
