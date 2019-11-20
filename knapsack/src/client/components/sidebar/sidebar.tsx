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
  addPage,
  disableEditMode,
  enableEditMode,
} from '../../store';
import { getTitleFromPath } from '../../../lib/routes';
import './sidebar.scss';

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const canEdit = useSelector(s => s.userState.canEdit);
  const isEditMode = useSelector(s => s.ui.isEditMode);
  const secondaryNavItems = useSelector(
    s => {
      return s.navsState.secondary.map(navItem => {
        if (!navItem.path) return navItem;
        const name = getTitleFromPath(navItem.path, s);
        return {
          ...navItem,
          name: name || navItem.name,
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
    <div className="ks-sidebar">
      {canEdit && (
        <div>
          <Button
            kind="primary"
            size="m"
            onClick={() => dispatch(saveToServer())}
          >
            Save it all
          </Button>
          <Button
            size="m"
            onClick={() =>
              dispatch(isEditMode ? disableEditMode() : enableEditMode())
            }
          >
            Turn edit mode {isEditMode ? 'off' : 'on'}
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
    </div>
  );
};
