import React from 'react';
import { action } from '@storybook/addon-actions';
import PropMatrix from 'react-prop-matrix';
import { KsButton, SIZES, KINDS, EMPHASSIS } from './button';

export default {
  title: 'Components|Atoms/KsButton',
  component: KsButton,
  decorators: [],
  parameters: {},
};

const options = {
  size: Object.keys(SIZES),
  kind: Object.keys(KINDS),
  emphasis: Object.keys(EMPHASSIS),
};
export const allVariations = () => (
  <PropMatrix options={options}>
    {({ text, kind, emphasis, ...props }) => (
      <>
        <KsButton
          handleTrigger={action('button-click')}
          kind={kind}
          icon={kind === 'icon' || kind === 'icon-standard' ? 'add' : null}
          emphasis={emphasis}
          {...props}
        >
          {emphasis === 'danger' && (
            <span style={{ textTransform: 'capitalize' }}>{emphasis} </span>
          )}
          <span style={{ textTransform: 'capitalize' }}>{kind} </span>
          Button
        </KsButton>
        <hr />
      </>
    )}
  </PropMatrix>
);
