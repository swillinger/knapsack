import React from 'react';
import { Tabs } from '../components/tabs';
import { useSelector } from '../store';
import PageWithSidebar from '../layouts/page-with-sidebar';
import { PatternGrid } from '../components/pattern-grid';
import { PatternTable } from '../components/pattern-table';

export const PatternListPage: React.FC = () => {
  const patterns = useSelector(s => s.patternsState.patterns);
  const allPatterns = Object.values(patterns);

  const panes = [
    {
      menuItem: 'Table',
      render: () => <PatternTable allPatterns={allPatterns} />,
    },
    {
      menuItem: 'Grid',
      render: () => (
        <PatternGrid
          patterns={allPatterns.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
          }))}
        />
      ),
    },
  ];

  return (
    <PageWithSidebar title="Patterns">
      <Tabs menu={{ pointing: true }} panes={panes} />
    </PageWithSidebar>
  );
};
