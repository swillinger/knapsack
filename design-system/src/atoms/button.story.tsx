import React from 'react';
import { action } from '@storybook/addon-actions';
import PropMatrix from 'react-prop-matrix';
import { KsButton, sizes, kinds, emphasiss } from './button';

export default {
  title: 'Components|Atoms/KsButton',
  component: KsButton,
  decorators: [],
  parameters: {},
};

const options = {
  size: sizes,
  kind: kinds,
  emphasis: emphasiss,
};
export const allVariations = () => (
  <PropMatrix options={options}>
    {({ text, kind, emphasis, ...props }) => (
      <>
        <KsButton
          onClick={action('button-click')}
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
