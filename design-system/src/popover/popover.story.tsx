import React from 'react';
import { boolean, select } from '@storybook/addon-knobs';
import { KsPopover } from './popover';

export default {
  title: 'Components|Popover',
  component: KsPopover,
  decorators: [],
  parameters: {},
};

const Wrapper = ({ children }) => (
  <div
    style={{
      height: '80vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {children}
  </div>
);

const content = (
  <div
    style={{
      // background: '#ccc',
      padding: '50px 75px',
    }}
  >
    I am in the popover!
  </div>
);

const position = () =>
  select('Position', ['left', 'right', 'top', 'bottom'], 'bottom');
const align = () => select('Align', ['start', 'center', 'end'], 'center');

export const simple = () => {
  const isOpen = boolean('isOpen', true);
  return (
    <Wrapper>
      <KsPopover
        isOpen={isOpen}
        content={content}
        position={position()}
        align={align()}
      >
        <span>The Children</span>
      </KsPopover>
    </Wrapper>
  );
};

export const hoverable = () => {
  return (
    <Wrapper>
      <KsPopover
        isHoverTriggered
        content={content}
        position={position()}
        align={align()}
      >
        <span>The Children(hover)</span>
      </KsPopover>
    </Wrapper>
  );
};
