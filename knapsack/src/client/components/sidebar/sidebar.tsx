import React from 'react';
import { Button } from '@knapsack/design-system';
import { SecondaryNav } from './secondary-nav';
import {
  saveToServer,
  useDispatch,
  useSelector,
  updateSecondaryNav,
} from '../../store';
import { PERMISSIONS } from '../../../lib/constants';

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const hasWritePermission = useSelector(s =>
    s.userState.role.permissions.includes(PERMISSIONS.WRITE),
  );
  const secondaryNavItems = useSelector(s => s.navsState.secondary);

  return (
    <aside className="k-sidebar">
      {hasWritePermission && (
        <div>
          <Button
            kind="primary"
            size="m"
            onClick={() => dispatch(saveToServer())}
          >
            Save it all
          </Button>
          <hr />
        </div>
      )}
      <SecondaryNav
        secondaryNavItems={secondaryNavItems}
        hasWritePermission={hasWritePermission}
        handleNewNavItems={newNavItems => {
          dispatch(updateSecondaryNav(newNavItems));
        }}
      />
    </aside>
  );
};
