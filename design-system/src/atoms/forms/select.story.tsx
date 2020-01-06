import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { KsSelect, SelectOptionProps } from './select';

export default {
  title: 'Components|Atoms/Select',
  component: KsSelect,
  decorators: [],
  parameters: {},
};

const items: SelectOptionProps[] = [
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b' },
  { label: 'C', value: 'c' },
];

export const ownState = () => (
  <KsSelect
    options={items}
    handleChange={action('select-change')}
    label="Select Menu"
  />
);

export const ParentFormState = () => {
  const [value, setValue] = useState(items[0]);

  action('form-state')(value);

  return (
    <KsSelect
      value={value}
      options={items}
      handleChange={newValue => {
        action('controlled-select-change')(newValue);
        setValue(newValue);
      }}
      label="Select Menu"
    />
  );
};
