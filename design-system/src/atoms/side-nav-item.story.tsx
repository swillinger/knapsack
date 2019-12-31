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
          <SideNavItem
            handleDelete={() => {}}
            handleEdit={() => {}}
            title="Title"
            statuses={[
              {
                templateId: '1',
                templateTitle: 'React',
                templateLanguageId: '11',
                path: 'patterns/thing',
                status: {
                  id: 'status-1',
                  title: 'Ready',
                  color: '#00c156',
                },
              },
              {
                templateId: '2',
                templateTitle: 'Twig',
                templateLanguageId: '22',
                path: 'patterns/thing2',
                status: {
                  id: 'status-2',
                  title: 'Broken',
                  color: '#dd0000',
                },
              },
            ]}
            {...props}
          />
        </>
      )}
    </PropMatrix>
  </div>
);
