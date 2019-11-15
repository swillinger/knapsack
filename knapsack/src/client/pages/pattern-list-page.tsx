import React from 'react';
import { useSelector } from '../store';
import PageWithSidebar from '../layouts/page-with-sidebar';
import { PatternGrid } from '../components/pattern-grid';

export const PatternListPage: React.FC = () => {
  const patterns = useSelector(s => s.patternsState.patterns);
  const allPatterns = Object.values(patterns);

  return (
    <PageWithSidebar title="Patterns">
      <PatternGrid
        patterns={allPatterns.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
        }))}
      />
    </PageWithSidebar>
  );
};
