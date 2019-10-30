import React from 'react';
import { Spinner } from './spinner';

export default {
  title: 'Components|Spinner',
  component: Spinner,
  parameters: {
    percy: {
      skip: true,
    },
  },
};

export const simple = () => <Spinner />;
export const withText = () => <Spinner text="Some loading text..." />;
