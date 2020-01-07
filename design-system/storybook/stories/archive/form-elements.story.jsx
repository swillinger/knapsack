/* eslint-disable import/no-unresolved */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { TextInputWrapper, KsSelect } from '@knapsack/atoms';
import { action } from '@storybook/addon-actions';

storiesOf('Form Elements', module)
  .add('Select', () => (
    <KsSelect
      handleChange={action('option changed')}
      options={[
        {
          label: 'Option 1',
          value: 'option1',
        },
        {
          label: 'Option 2',
          value: 'option2',
        },
        {
          label: 'Option 3',
          value: 'option3',
        },
      ]}
    />
  ))
  .add('Text Input', () => (
    <TextInputWrapper>
      <input placeholder="Type here..." />
    </TextInputWrapper>
  ))
  .add('Text Area Input', () => (
    <TextInputWrapper>
      <textarea placeholder="Type here..." />
    </TextInputWrapper>
  ));
// .add('Text Area Input', () => <TextAreaInput placeholder="Type here..." />);
