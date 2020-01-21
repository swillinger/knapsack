import React, { useState } from 'react';
import {
  KsButton,
  KsButtonToggleWrapper,
  KsPopover,
} from '@knapsack/design-system';
import { useSelector } from '../store';
import PageWithSidebar from '../layouts/page-with-sidebar';
import { PatternGrid } from '../components/pattern-grid';
import { PatternTable } from '../components/pattern-table';
import './pattern-list-page.scss';

const PatternListPage: React.FC = () => {
  const patterns = useSelector(s => s.patternsState.patterns);
  const allPatterns = Object.values(patterns);
  const [viewToggle, setViewToggle] = useState('grid');

  return (
    <PageWithSidebar title="Patterns">
      <div
        className="pattern-list-page__toggles"
        style={{
          display: 'none', // @todo finish implementing "table"
        }}
      >
        <KsButtonToggleWrapper>
          <KsPopover content={<p>Toggle Grid View</p>}>
            <KsButton
              icon="grid-view"
              active={viewToggle === 'grid'}
              handleTrigger={() => setViewToggle('grid')}
            />
          </KsPopover>
          <KsPopover content={<p>Toggle Table View</p>}>
            <KsButton
              icon="table-view"
              active={viewToggle === 'table'}
              handleTrigger={() => setViewToggle('table')}
            />
          </KsPopover>
        </KsButtonToggleWrapper>
      </div>

      {viewToggle === 'grid' && (
        <PatternGrid
          patterns={allPatterns.map(p => ({
            id: p.id,
            title: p.title,
          }))}
        />
      )}

      {viewToggle === 'table' && <PatternTable allPatterns={allPatterns} />}
    </PageWithSidebar>
  );
};

export default PatternListPage;
