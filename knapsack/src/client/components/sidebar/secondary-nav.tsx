import React, { useState } from 'react';
import SortableTree, {
  getTreeFromFlatData,
  getFlatDataFromTree,
  toggleExpandedForAll,
  changeNodeAtPath,
  TreeIndex,
  TreeNode,
  ExtendedNodeData,
} from 'react-sortable-tree';
// import FileExplorerTheme from 'react-sortable-tree-theme-minimal';
import cn from 'classnames';
import { NavLink } from 'react-router-dom';
import SortableTreeTheme from './sortable-tree-theme/sortable-tree-theme';
import { KnapsackNavItem } from '../../../schemas/nav';
import { AddEntity } from './add-entity';
import './secondary-nav.scss';

// type KnapsackNavItemProps = {
//   title: React.ReactNode;
//   path?: string;
// };

// export const NavItem: React.FC<KnapsackNavItemProps> = ({
//   title,
//   path,
// }: KnapsackNavItemProps) => {
//   const theTitle = path ? <NavLink to={path}>{title}</NavLink> : title;
//   const classes = cn({
//     'ks-nav-item': true,
//     'ks-nav-item--link': path,
//   });
//   return <span className={classes}>{theTitle}</span>;
// };

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
