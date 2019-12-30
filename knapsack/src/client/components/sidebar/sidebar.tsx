import React, { useState, useMemo } from 'react';
import cn from 'classnames';
import { KsButton, Icon } from '@knapsack/design-system';
import {
  getTreeFromFlatData,
  getFlatDataFromTree,
  toggleExpandedForAll,
  TreeIndex,
  TreeNode,
} from 'react-sortable-tree';
import deepEqual from 'deep-equal';
import { useHistory } from 'react-router';
import slugify from 'slugify';
import { SecondaryNav } from './secondary-nav';
import { AddEntity } from './add-entity';
import {
  useDispatch,
  useSelector,
  updateSecondaryNav,
  addPage,
  addSecondaryNavItem,
  addPattern,
} from '../../store';
import { getTitleFromPath } from '../../../lib/routes';
import './sidebar.scss';
import { KnapsackNavItem } from '../../../schemas/nav';
import { BASE_PATHS } from '../../../lib/constants';

const rootKey = 'root';

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const canEdit = useSelector(s => s.userState.canEdit);
  const secondaryNavItems = useSelector(s => {
    return s.navsState.secondary.map(navItem => {
      if (!navItem.path) return navItem;
      // const name = getTitleFromPath(navItem.path, s);
      return {
        ...navItem,
        name: navItem.name || navItem.path,
      };
    });
  }, deepEqual);
  const history = useHistory();

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
    // fixes this weird bug where the nav appears blank sometimes
    setTimeout(() => {
      setTreeItems(expandedTreeItems);
    }, 250);
    return expandedTreeItems;
  }, [JSON.stringify(secondaryNavItems)]);

  return (
    <div className="ks-sidebar">
      <div className="ks-sidebar__search-container">
        <div className="ks-text-field ks-text-field--flush ks-text-field--space-m">
          <div className="ks-text-field__wrapper ks-text-field__wrapper--icon ks-text-field__input-icon-wrapper">
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

      {canEdit && (
        <>
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
              <AddEntity
                handleAdd={({ title: theTitle, entityType }) => {
                  // eslint-disable-next-line default-case
                  switch (entityType) {
                    case 'pattern': {
                      const patternId = slugify(theTitle.toLowerCase());
                      dispatch(
                        addPattern({
                          title: theTitle,
                          patternId,
                        }),
                      );
                      setTimeout(() => {
                        history.push(`${BASE_PATHS.PATTERN}/${patternId}`);
                      }, 1000);
                      break;
                    }
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
                      getNodeKey: (
                        item: TreeIndex & TreeNode & KnapsackNavItem,
                      ) => item.id,
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
        </>
      )}
    </div>
  );
};
