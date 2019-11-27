import React, { useState } from 'react';
import {
  getTreeFromFlatData,
  toggleExpandedForAll,
  ExtendedNodeData,
  SortableTreeWithoutDndContext as SortableTree,
} from 'react-sortable-tree';
import SortableTreeTheme from './sortable-tree-theme/sortable-tree-theme';
import { KnapsackNavItem } from '../../../schemas/nav';
import './secondary-nav.scss';

type Props = {
  canEdit?: boolean;
  isSidebarEditMode?: boolean;
  secondaryNavItems: KnapsackNavItem[];
  handleNewNavItems?: (newNavItems: KnapsackNavItem[]) => void;
};

const rootKey = 'root';

export const SecondaryNav: React.FC<Props> = ({
  secondaryNavItems = [],
  canEdit,
  isSidebarEditMode,
  handleNewNavItems = () => {},
}: Props) => {
  const initialFlatData = {
    rootKey,
    flatData: secondaryNavItems,
    getKey: item => item.id,
    getParentKey: item => item.parentId,
  };
  const initialTreeData = getTreeFromFlatData(initialFlatData);
  const expandedTreeData = toggleExpandedForAll({ treeData: initialTreeData });
  const [treeData, setTreeData] = useState(expandedTreeData);

  return (
    <nav className="ks-secondary-nav">
      <SortableTree
        treeData={treeData}
        theme={SortableTreeTheme}
        canDrag={canEdit && isSidebarEditMode}
        onChange={newTreeData => setTreeData(newTreeData)}
        searchQuery='bu'
        generateNodeProps={(data: ExtendedNodeData) => {
          const title = data.node.name;
          const { path } = data.node;
          return {
            title,
            path,
            isSidebarEditMode,
          };
        }}
      />
    </nav>
  );
};
