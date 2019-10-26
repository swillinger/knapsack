/* eslint-disable import/no-unresolved */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Spinner from '@knapsack/spinner';
import { text } from '@storybook/addon-knobs';

storiesOf('Spinner', module).add('Overview', () => {
  const theText = text('Loading Text', '');
  return <Spinner text={theText} />;
});
