import React from 'react';
import { action } from '@storybook/addon-actions';
import PropMatrix from 'react-prop-matrix';
import { KsTextField } from './text-input';

export default {
  title: 'Components|Atoms/KsTextField',
  component: KsTextField,
  decorators: [],
  parameters: {},
};

const options = {
  isLabelInline: [false, true],
  error: [null, 'Something is incorrect.'],
  description: [
    null,
    'Description text can help the user when an input has special requirements, but usually is not needed.',
  ],
  placeholder: [null, 'Placeholder Text'],
  endIcon: [null, 'search'],
  label: ['Label Text', null],
};
export const allVariations = () => (
  <PropMatrix options={options}>
    {({ ...props }) => (
      <>
        <KsTextField {...props} />
        <hr />
      </>
    )}
  </PropMatrix>
);
