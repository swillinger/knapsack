import React from 'react';
import { Spinner, CircleSpinner } from './spinner';

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
export const circle = () => (
  <>
    <CircleSpinner />
    <hr />
    <h2>
      A heading element <CircleSpinner />
    </h2>
    <hr />
    <h4>
      Another heading element <CircleSpinner />
    </h4>
    <hr />
    <p>
      Some text <CircleSpinner />
    </p>
  </>
);
