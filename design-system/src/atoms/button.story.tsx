import React from 'react';
import { action } from '@storybook/addon-actions';
import PropMatrix from 'react-prop-matrix';
import { Button, sizes, kinds } from './button';

export default {
  title: 'Components|Atoms/Button',
  component: Button,
  decorators: [],
  parameters: {},
};

const options = {
  size: sizes,
  kind: kinds,
  text: ['A Button', 'A Button With A Lot of Text'],
};
export const allVariations = () => (
  <PropMatrix options={options}>
    {({ text, ...props }) => (
      <>
        <Button onClick={action('button-click')} {...props}>
          {text}
        </Button>
        <hr />
      </>
    )}
  </PropMatrix>
);
