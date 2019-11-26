import React, { Children, cloneElement } from 'react';
import './tree-node-renderer.scss';

type Props = {
  treeIndex: number;
  treeId: string;
  swapFrom?: number;
  swapDepth?: number;
  swapLength?: number;
  scaffoldBlockPxWidth: number;
  lowerSiblingCounts: number[];

  listIndex: number;
  children: React.ReactElement;

  // Drop target
  connectDropTarget: Function;
  isOver: boolean;
  canDrop?: boolean;
  draggedNode?: {};

  // used in dndManager
  getPrevRow: Function;
  node: {};
  path: string[] | number[];
  rowDirection: string;
};

export const FileThemeTreeNodeRenderer: React.FC<Props> = ({
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
}: Props) => {
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
