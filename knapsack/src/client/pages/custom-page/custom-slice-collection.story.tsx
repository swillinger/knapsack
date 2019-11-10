import React from 'react';
import { action } from '@storybook/addon-actions';
import { CustomSliceCollection } from './custom-slice-collection';

export default {
  title: 'App|CustomSlices/Collection',
  component: CustomSliceCollection,
  decorators: [],
  parameters: {},
};

export const simple = () => (
  <CustomSliceCollection handleSave={action('handle-save')} userCanSave />
);
