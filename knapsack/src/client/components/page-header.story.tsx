import React from 'react';
import PropMatrix from 'react-prop-matrix';
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

export const withStatus = () => (
  <PageHeader
    section="Section Name"
    title="Page Title"
    status={{
      type: 'success',
      message:
        'A success message - Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    }}
  />
);

const options = {
  title: ['A Page Title', ''],
  section: ['A Section Title', ''],
  status: [
    {
      type: 'info',
      message:
        'Some info - Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    null,
  ],
};

export const allVariations = () => (
  <PropMatrix options={options}>
    {props => (
      <>
        <PageHeader {...props} />
        <hr />
      </>
    )}
  </PropMatrix>
);
