import React, { useState, useMemo } from 'react';
import cn from 'classnames';
import { KsButton, Icon } from '@knapsack/design-system';
import { shallowEqual } from 'react-redux';
import {
  getTreeFromFlatData,
  getFlatDataFromTree,
  toggleExpandedForAll,
  TreeIndex,
  TreeNode,
} from 'react-sortable-tree';
import deepEqual from 'deep-equal';
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
import { KnapsackNavItem } from '../../../schemas/nav';

const rootKey = 'root';

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const canEdit = useSelector(s => s.userState.canEdit);
  const secondaryNavItems = useSelector(s => {
    return s.navsState.secondary.map(navItem => {
      if (!navItem.path) return navItem;
      const name = getTitleFromPath(navItem.path, s);
      return {
        ...navItem,
        name: name || navItem.name,
      };
    });
  }, deepEqual);

  const [isSidebarEditMode, setIsSidebarEditMode] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [treeItems, setTreeItems] = useState([]);
  const initialTreeItems = useMemo(() => {
    const initialFlatData = {
      rootKey,
      flatData: secondaryNavItems,
      getKey: item => item.id,
      getParentKey: item => item.parentId,
    };
    const initialTreeData = getTreeFromFlatData(initialFlatData);
    const expandedTreeItems = toggleExpandedForAll({
      treeData: initialTreeData,
    });
    setTreeItems(expandedTreeItems);
    return expandedTreeItems;
  }, [JSON.stringify(secondaryNavItems)]);

  return (
    <div className="ks-sidebar">
      <div className="ks-sidebar__search-container">
        <div className="ks-text-field ks-text-field--flush">
          {/* @TODO: Wire up left nav searching
                    This will likely work with the sortable tree's searchQuery option:
                    https://github.com/frontend-collective/react-sortable-tree#props
          */}
          <div className="ks-text-field__input-icon-wrapper">
            <input
              type="text"
              className="ks-text-field__input"
              placeholder="Filter"
              onChange={event => setSearchString(event.target.value)}
              value={searchString}
            />
            <span className="ks-text-field__end-icon">
              <Icon symbol="search" />
            </span>
          </div>
        </div>
      </div>

      <div className="ks-sidebar__content">
        <SecondaryNav
          treeItems={treeItems}
          searchString={searchString}
          // if the secondary nav list changes, this key changes, trigger a full re-mount to refresh state and names
          // key={md5(JSON.stringify(treeItems))}
          canEdit={canEdit}
          handleNewTreeItems={setTreeItems}
          isSidebarEditMode={isSidebarEditMode}
        />
      </div>

      <div
        className={cn(
          'ks-sidebar__enable-edit-btn',
          isSidebarEditMode ? 'ks-sidebar__enable-edit-btn--hidden' : '',
        )}
      >
        <KsButton
          kind="icon-standard"
          icon="edit"
          floating
          onClick={() => setIsSidebarEditMode(true)}
        >
          Edit Left Navigation
        </KsButton>
      </div>

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
            <KsButton
              kind="cancel"
              onClick={() => {
                setTreeItems(initialTreeItems);
                setIsSidebarEditMode(false);
              }}
            >
              Cancel
            </KsButton>
            <KsButton
              kind="primary"
              onClick={() => {
                const newFlatData = getFlatDataFromTree({
                  treeData: treeItems,
                  ignoreCollapsed: false,
                  getNodeKey: (item: TreeIndex & TreeNode & KnapsackNavItem) =>
                    item.id,
                }).map(flatDataItem => {
                  // console.log({ flatDataItem });
                  const { node, parentNode } = flatDataItem;
                  return {
                    id: node.id,
                    name: node.name,
                    path: node.path || '',
                    parentId: parentNode ? parentNode.id : rootKey,
                  };
                });

                dispatch(updateSecondaryNav(newFlatData));

                setIsSidebarEditMode(false);
              }}
            >
              Save
            </KsButton>
          </div>
        </div>
      </div>
    </div>
  );
};
