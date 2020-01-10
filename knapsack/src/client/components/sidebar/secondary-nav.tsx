import React from 'react';
import {
  ExtendedNodeData,
  SortableTreeWithoutDndContext as SortableTree,
  TreeItem,
} from 'react-sortable-tree';
import SortableTreeTheme from './sortable-tree-theme/sortable-tree-theme';
import { ExtraProps } from './sortable-tree-theme/node-content-renderer';
import './secondary-nav.scss';

type Props = {
  canEdit?: boolean;
  isSidebarEditMode?: boolean;
  searchString?: string;
  handleNewTreeItems?: (newNavItems: TreeItem[]) => void;
  treeItems: TreeItem[];
};

const customSearchMethod = ({ node, searchQuery }) => {
  return ( searchQuery && node.name && node.name.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1 );
};
const searchFocusIndex = 0;

export const SecondaryNav: React.FC<Props> = ({
  canEdit,
  isSidebarEditMode,
  searchString,
  handleNewTreeItems = () => {},
  treeItems,
}: Props) => {
  if (!treeItems) return null;

  return (
    <nav className="ks-secondary-nav">
      <SortableTree
        treeData={treeItems}
        theme={SortableTreeTheme}
        canDrag={canEdit && isSidebarEditMode}
        onChange={newTreeData => handleNewTreeItems(newTreeData)}
        searchMethod={customSearchMethod}
        searchQuery={searchString}
        searchFocusOffset={searchFocusIndex}
        generateNodeProps={(data: ExtendedNodeData) => {
          const extraProps: ExtraProps = {
            ksNavItem: {
              path: data.node.path,
              name: data.node.name,
            },
            isSidebarEditMode,
          };
          return extraProps;
        }}
      />
    </nav>
  );
};
