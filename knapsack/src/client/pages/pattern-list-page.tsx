import React from 'react';
import {
  KsButton,
  KsButtonToggleWrapper,
  KsPopover,
} from '@knapsack/design-system';
import {
  useSelector,
  useDispatch,
  setPatternPageViewPreference,
} from '../store';
import PageWithSidebar from '../layouts/page-with-sidebar';
import { PatternGrid } from '../components/pattern-grid';
import { PatternTable } from '../components/pattern-table';
import './pattern-list-page.scss';

const PatternListPage: React.FC = () => {
  const patterns = useSelector(s => s.patternsState.patterns);
  const allPatterns = Object.values(patterns);
  const { patternViewPreference } = useSelector(s => s.ui);
  const dispatch = useDispatch();

  return (
    <PageWithSidebar title="Patterns">
      <div className="pattern-list-page__toggles">
        <KsButtonToggleWrapper>
          <KsPopover content={<p>Toggle Grid View</p>}>
            <KsButton
              icon="grid-view"
              active={patternViewPreference === 'grid'}
              handleTrigger={() =>
                dispatch(setPatternPageViewPreference({ preference: 'grid' }))
              }
            />
          </KsPopover>
          <KsPopover content={<p>Toggle Table View</p>}>
            <KsButton
              icon="table-view"
              active={patternViewPreference === 'table'}
              handleTrigger={() =>
                dispatch(setPatternPageViewPreference({ preference: 'table' }))
              }
            />
          </KsPopover>
        </KsButtonToggleWrapper>
      </div>

      {patternViewPreference === 'grid' && (
        <PatternGrid
          patterns={allPatterns.map(p => ({
            id: p.id,
            title: p.title,
          }))}
        />
      )}

      {patternViewPreference === 'table' && (
        <PatternTable allPatterns={allPatterns} />
      )}
    </PageWithSidebar>
  );
};

export default PatternListPage;
