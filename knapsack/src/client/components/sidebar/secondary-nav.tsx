import React, { useState } from 'react';
import { Button } from '@knapsack/design-system';
import SortableTree, {
  getTreeFromFlatData,
  getFlatDataFromTree,
  toggleExpandedForAll,
  changeNodeAtPath,
  TreeIndex,
  TreeNode,
  ExtendedNodeData,
} from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import cn from 'classnames';
import { NavLink } from 'react-router-dom';
import { KnapsackNavItem } from '../../../schemas/nav';

type KnapsackNavItemProps = {
  title: React.ReactNode;
  path?: string;
};

export const NavItem: React.FC<KnapsackNavItemProps> = ({
  title,
  path,
}: KnapsackNavItemProps) => {
  const theTitle = path ? <NavLink to={path}>{title}</NavLink> : title;
  const classes = cn({
    'ks-nav-item': true,
    'ks-nav-item--link': path,
  });
  return <span className={classes}>{theTitle}</span>;
};

type Props = {
  canEdit?: boolean;
  secondaryNavItems: KnapsackNavItem[];
  handleNewNavItems?: (newNavItems: KnapsackNavItem[]) => void;
};

const rootKey = 'root';

export const SecondaryNav: React.FC<Props> = ({
  secondaryNavItems = [],
  canEdit,
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
    <aside className="ks-secondary-nav">
      <header className="ks-secondary-nav__header">
        <Button
          size="s"
          onClick={() => {
            const newFlatData = getFlatDataFromTree({
              treeData,
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

            handleNewNavItems(newFlatData);
          }}
        >
          Save menu changes
        </Button>
      </header>
      <hr />
      <nav className="ks-secondary-nav__tree" style={{ height: 900 }}>
        <SortableTree
          treeData={treeData}
          theme={FileExplorerTheme}
          canDrag={canEdit}
          onChange={newTreeData => setTreeData(newTreeData)}
          generateNodeProps={(data: ExtendedNodeData) => {
            // console.log('generateNodeProps', data);
            return {
              title: <NavItem title={data.node.name} path={data.node.path} />,
            };
          }}

          // generateNodeProps={({ node, path }) => ({
          //   title: (
          //     <input
          //       style={{ fontSize: '1.1rem' }}
          //       value={node.title}
          //       onChange={event => {
          //         const name = event.target.value;
          //
          //         setTreeData(currentTreeData =>
          //           changeNodeAtPath({
          //             treeData: currentTreeData,
          //             path,
          //             getNodeKey: ({ treeIndex }) => treeIndex,
          //             newNode: { ...node, name },
          //           }),
          //         );
          //       }}
          //     />
          //   ),
          // })}
        />
      </nav>
    </aside>
  );
};
