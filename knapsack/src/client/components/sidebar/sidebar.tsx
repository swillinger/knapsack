import React from 'react';
import { Link } from 'react-router-dom';
import { KsButton } from '@knapsack/design-system';
import md5 from 'md5';
import { shallowEqual } from 'react-redux';
import { SecondaryNav } from './secondary-nav';
import {
  saveToServer,
  useDispatch,
  useSelector,
  updateSecondaryNav,
  disableEditMode,
  enableEditMode,
} from '../../store';
import { getTitleFromPath } from '../../../lib/routes';
import './sidebar.scss';

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const canEdit = useSelector(s => s.userState.canEdit);
  const isLocalDev = useSelector(s => s.userState.isLocalDev);
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
          {isLocalDev && (
            <>
              <KsButton
                kind="primary"
                size="m"
                onClick={() =>
                  dispatch(
                    saveToServer({
                      storageLocation: 'local',
                    }),
                  )
                }
              >
                Local dev: Save All
              </KsButton>
              <br />
              <br />
            </>
          )}

          <Link to="/propose-change">
            <KsButton kind="primary" size="m">
              PR: Propose Change
            </KsButton>
          </Link>
          <br />
          <br />
          <KsButton
            kind="primary"
            size="m"
            onClick={() => dispatch(saveToServer({ storageLocation: 'local' }))}
          >
            Save it all
          </KsButton>
          <KsButton
            size="m"
            onClick={() =>
              dispatch(isEditMode ? disableEditMode() : enableEditMode())
            }
          >
            Turn edit mode {isEditMode ? 'off' : 'on'}
          </KsButton>
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
