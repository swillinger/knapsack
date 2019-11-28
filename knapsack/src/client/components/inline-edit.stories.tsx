import React from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { InlineEditTextBase as InlineEditText } from './inline-edit';

export default {
  title: 'Components|InlineEditText',
  component: InlineEditText,
  decorators: [withKnobs],
  parameters: {},
};

const text = 'Here is some text';
const textLong = `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

export const simple = () => {
  const showControls = boolean('showControls', true);
  return (
    <>
      <h2>
        <InlineEditText
          canEdit
          showControls={showControls}
          text={text}
          handleSave={action('save')}
          isHeading
        />
      </h2>

      <hr />
      <h2>
        <InlineEditText
          canEdit
          showControls={showControls}
          text={textLong}
          handleSave={action('save')}
          isHeading
        />
      </h2>

      <hr />
      <p>
        <InlineEditText
          canEdit
          showControls={showControls}
          text={text}
          handleSave={action('save')}
        />
      </p>

      <hr />
      <p>
        <InlineEditText
          canEdit
          showControls={showControls}
          text={textLong}
          handleSave={action('save')}
        />
      </p>
    </>
  );
};
