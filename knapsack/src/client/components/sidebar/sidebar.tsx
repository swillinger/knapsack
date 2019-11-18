import React from 'react';
import { Button } from '@knapsack/design-system';
import md5 from 'md5';
import { shallowEqual } from 'react-redux';
import { SecondaryNav } from './secondary-nav';
import {
  saveToServer,
  useDispatch,
  useSelector,
  updateSecondaryNav,
} from '../../store';
import { getTitleFromPath } from '../../../lib/routes';

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const canEdit = useSelector(s => s.userState.canEdit);
  const secondaryNavItems = useSelector(
    s => {
      return s.navsState.secondary.map(navItem => {
        if (!navItem.path) return navItem;
        const name = getTitleFromPath(navItem.path, s);
        return {
          name: name || navItem.path,
          ...navItem,
        };
      });
    },
    (a, b) => {
      return shallowEqual(
        a.map(({ name }) => name),
        b.map(({ name }) => name),
      );
    },
  );

  return (
    <aside className="ks-sidebar">
      {canEdit && (
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
        // if the secondary nav list changes, this key changes, trigger a full re-mount to refresh state and names
        key={md5(JSON.stringify(secondaryNavItems))}
        canEdit={canEdit}
        handleNewNavItems={newNavItems => {
          dispatch(updateSecondaryNav(newNavItems));
        }}
      />
    </aside>
  );
};
