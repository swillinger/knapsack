import React, { Children, cloneElement } from 'react';
import { TreeRendererProps } from 'react-sortable-tree';
import './tree-node-renderer.scss';

export const FileThemeTreeNodeRenderer: React.FC<TreeRendererProps> = ({
  children,
  listIndex,
  swapFrom = null,
  swapLength = null,
  swapDepth = null,
  scaffoldBlockPxWidth,
  lowerSiblingCounts,
  connectDropTarget,
  isOver,
  draggedNode = null,
  canDrop = false,
  treeIndex,
  treeId,
  getPrevRow,
  node,
  path,
  rowDirection,
  ...otherProps
}: TreeRendererProps) => {
  return connectDropTarget(
    <div {...otherProps} className="node">
      {Children.map(children, child =>
        cloneElement(child, {
          isOver,
          canDrop,
          draggedNode,
          lowerSiblingCounts,
          listIndex,
          swapFrom,
          swapLength,
          swapDepth,
        }),
      )}
    </div>,
  );
};

export default FileThemeTreeNodeRenderer;
