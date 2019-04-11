import React from 'react';
import { plugins } from '@knapsack/core';

export default Component => {
  // eslint-disable-next-line no-unused-vars
  plugins.register('custom-homepage', api => {
    plugins.setHomePage({
      render: props => <Component {...props} />,
    });
  });
};
