import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { Select } from './select';

export default {
  title: 'Components|Atoms/Select',
  component: Select,
  decorators: [],
  parameters: {},
};

const items = [{ value: 'a' }, { value: 'b' }, { value: 'c' }];

export const ownState = () => (
  <Select items={items} handleChange={action('select-change')} />
);

export const ParentFormState = () => {
  const [value, setValue] = useState(items[1].value);

  action('form-state')(value);
  return (
    <Select
      value={value}
      items={items}
      handleChange={newValue => {
        action('controlled-select-change')(newValue);
        setValue(newValue);
      }}
    />
  );
};
