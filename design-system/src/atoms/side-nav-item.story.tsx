import React from 'react';
import PropMatrix from 'react-prop-matrix';
import { SideNavItem } from './side-nav-item';

export default {
  title: 'Components|Molecules/SideNavItem',
  component: SideNavItem,
  decorators: [],
  parameters: {},
};

const options = {
  isEditMode: [false, true],
  path: [null, '/'],
  active: [false, true],
  hasChildren: [false, true],
  statusColor: [null, '#2ecc40'],
};
export const allVariations = () => (
  <div
    style={{
      backgroundColor: '#f8f8f8',
      maxWidth: 'var(--sidebar-width)',
      marginLeft: 'var(--space-xl)',
    }}
  >
    <PropMatrix options={options}>
      {({ ...props }) => (
        <>
          <SideNavItem title="Title" {...props} />
        </>
      )}
    </PropMatrix>
  </div>
);
