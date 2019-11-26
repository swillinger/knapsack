import React, { useState } from 'react';

import cn from 'classnames';
import { Button } from '@knapsack/design-system';
import md5 from 'md5';
import { shallowEqual } from 'react-redux';
import { SecondaryNav } from './secondary-nav';
import { AddEntity } from './add-entity';
import {
  useDispatch,
  useSelector,
  updateSecondaryNav,
  addPage,
  addSecondaryNavItem,
} from '../../store';
import { getTitleFromPath } from '../../../lib/routes';
import './sidebar.scss';

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const canEdit = useSelector(s => s.userState.canEdit);
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
  // @TODO: Consider using store methods instead of state?
  const [isSidebarEditMode, setIsSidebarEditMode] = useState(false);

  return (
    <div className="ks-sidebar">
      <div className="ks-sidebar__search-container">
        <input type="text" />
      </div>
      <div className="ks-sidebar__content">
        <SecondaryNav
          secondaryNavItems={secondaryNavItems}
          // if the secondary nav list changes, this key changes, trigger a full re-mount to refresh state and names
          key={md5(JSON.stringify(secondaryNavItems))}
          canEdit={canEdit}
          handleNewNavItems={newNavItems => {
            dispatch(updateSecondaryNav(newNavItems));
          }}
          isSidebarEditMode={isSidebarEditMode}
        />
      </div>

      <Button
        className={cn(
          'ks-sidebar__enable-edit-btn',
          isSidebarEditMode ? 'ks-sidebar__enable-edit-btn--hidden' : '',
        )}
        kind="icon-standard"
        icon="edit"
        floating
        onClick={() => setIsSidebarEditMode(true)}
      >
        Edit Left Navigation
      </Button>

      <div
        className={cn(
          'ks-sidebar__edit-panel',
          isSidebarEditMode ? 'ks-sidebar__edit-panel--show' : '',
        )}
      >
        <div className="ks-sidebar__edit-panel__content">
          {canEdit && (
            <AddEntity
              handleAdd={({ title: theTitle, entityType }) => {
                // eslint-disable-next-line default-case
                switch (entityType) {
                  case 'page': {
                    dispatch(
                      addPage({
                        title: theTitle,
                      }),
                    );
                    break;
                  }
                  case 'group': {
                    dispatch(
                      addSecondaryNavItem({
                        name: theTitle,
                      }),
                    );
                  }
                }
              }}
            />
          )}
          <div>
            <Button kind="cancel" onClick={() => setIsSidebarEditMode(false)}>
              Cancel
            </Button>
            <Button
              kind="primary"
              // @TODO: Wire up this save button!
              // This onclick method was blindly coppied over from secondary-nav.tsx,
              // something Evan wrote.
              // onClick={() => {
              //   const newFlatData = getFlatDataFromTree({
              //     treeData,
              //     ignoreCollapsed: false,
              //     getNodeKey: (item: TreeIndex & TreeNode & KnapsackNavItem) =>
              //       item.id,
              //   }).map(flatDataItem => {
              //     // console.log({ flatDataItem });
              //     const { node, parentNode } = flatDataItem;
              //     return {
              //       id: node.id,
              //       name: node.name,
              //       path: node.path || '',
              //       parentId: parentNode ? parentNode.id : rootKey,
              //     };
              //   });

              //   handleNewNavItems(newFlatData);
              //
              //   setIsSidebarEditMode(false);
              // }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
