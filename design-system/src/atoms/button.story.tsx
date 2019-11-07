import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from './button';

export default {
  title: 'Components|Atoms/Button',
  component: Button,
  decorators: [],
  parameters: {},
};

export const simple = () => (
  <Button onClick={action('button-click')}>I am a Button!</Button>
);

export const primary = () => (
  <Button primary onClick={action('button-click')}>
    I am a Primary Button!
  </Button>
);
