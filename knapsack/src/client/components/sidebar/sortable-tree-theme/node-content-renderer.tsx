import React from 'react';
import { NodeRendererProps, TreeItem } from 'react-sortable-tree';
import { SideNavItem } from '@knapsack/design-system';
import './node-content-renderer.scss';

export type ExtraProps = {
  isSidebarEditMode: boolean;
  ksNavItem: {
    path?: string;
    name: string;
  };
};

function isDescendant(older: TreeItem, younger: TreeItem): boolean {
  return (
    !!older.children &&
    typeof older.children !== 'function' &&
    older.children.some(
      child => child === younger || isDescendant(child, younger),
    )
  );
}

type Props = NodeRendererProps & ExtraProps;

export const FileThemeNodeContentRenderer: React.FC<Props> = ({
  scaffoldBlockPxWidth,
  toggleChildrenVisibility = null,
  connectDragPreview,
  connectDragSource,
  isDragging,
  canDrop = false,
  canDrag = false,
  node,
  title = null,
  draggedNode = null,
  path,
  treeIndex,
  isSearchMatch = false,
  isSearchFocus = false,
  icons = [],
  buttons = [],
  className = '',
  style = {},
  didDrop,
  lowerSiblingCounts,
  listIndex,
  swapFrom = null,
  swapLength = null,
  swapDepth = null,
  treeId, // Not needed, but preserved for other renderers
  isOver, // Not needed, but preserved for other renderers
  parentNode = null, // Needed for dndManager
  rowDirection,
  isSidebarEditMode,
  ksNavItem,
  ...otherProps
}: Props) => {
  const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
  const isLandingPadActive = !didDrop && isDragging;

  // Construct the scaffold representing the structure of the tree
  const scaffold = [];
  lowerSiblingCounts.forEach((lowerSiblingCount, i) => {
    if (i === 0) return;

    scaffold.push(
      <div
        key={`pre_${1 + i}`}
        style={{ width: scaffoldBlockPxWidth }}
        className="lineBlock"
      />,
    );

    if (treeIndex !== listIndex && i === swapDepth) {
      // This row has been shifted, and is at the depth of
      // the line pointing to the new destination
      let highlightLineClass = '';

      if (listIndex === swapFrom + swapLength - 1) {
        // This block is on the bottom (target) line
        // This block points at the target block (where the row will go when released)
        highlightLineClass = 'highlightBottomLeftCorner';
      } else if (treeIndex === swapFrom) {
        // This block is on the top (source) line
        highlightLineClass = 'highlightTopLeftCorner';
      } else {
        // This block is between the bottom and top
        highlightLineClass = 'highlightLineVertical';
      }

      scaffold.push(
        <div
          key={`highlight_${1 + i}`}
          style={{
            width: scaffoldBlockPxWidth,
            left: scaffoldBlockPxWidth * i,
          }}
          className={`absoluteLineBlock ${highlightLineClass}`}
        />,
      );
    }
  });

  const nodeContent = (
    <div {...otherProps} className="node-content">
      {/* {toggleChildrenVisibility && node.children && node.children.length > 0 && (
        <button
          type="button"
          aria-label={node.expanded ? 'Collapse' : 'Expand'}
          className={
            node.expanded ? 'collapseButton' : 'expandButton'
          }
          style={{
            left: (lowerSiblingCounts.length - 0.7) * scaffoldBlockPxWidth,
          }}

          onClick={() =>
            toggleChildrenVisibility({
              node,
              path,
              treeIndex,
            })
          }

        />
      )} */}
      {scaffold}
      <div className="node-content__inner">
        <SideNavItem
          title={ksNavItem.name}
          isEditMode={isSidebarEditMode}
          hasChildren={
            toggleChildrenVisibility &&
            node.children &&
            node.children.length > 0
          }
          isCollapsed={!node.expanded}
          onClickToggleCollapse={() =>
            // @TODO: Get this working...
            toggleChildrenVisibility({
              node,
              path,
              treeIndex,
            })
          }
          path={ksNavItem.path}
          active={
            ksNavItem.path
              ? window.location.href.includes(ksNavItem.path)
              : false
          }
          isDragging={isDragging}
          // @TODO: Wire up statuses
          // statusColor={}
          isSearchFocus={isSearchFocus}
          isSearchMatch={isSearchMatch}
        />
      </div>

      {/* <div
        className={
          "rowWrapper" +
          (!canDrag ? ' rowWrapperDragDisabled' : '')
        }
      > */}
      {/* Set the row preview to be used during drag and drop */}
      {/* {connectDragPreview(
          <div style={{ display: 'flex' }}>
            {scaffold}
            <div
              className={
                'row' +
                (isLandingPadActive ? ' rowLandingPad' : '') +
                (isLandingPadActive && !canDrop
                  ? ' rowCancelPad'
                  : '') +
                (isSearchMatch ? ' rowSearchMatch' : '') +
                (isSearchFocus ? ' rowSearchFocus' : '') +
                (className ? ` ${className}` : '')
              }
              style={{
                opacity: isDraggedDescendant ? 0.5 : 1,
                ...style,
              }}
            >
              <div
                className={
                  'rowContents' +
                  (!canDrag ? ' rowContentsDragDisabled' : '')
                }
              >
                <div className="rowToolbar">
                  {icons.map((icon, index) => (
                    <div
                      key={index} // eslint-disable-line react/no-array-index-key
                      className="toolbarButton"
                    >
                      {icon}
                    </div>
                  ))}
                </div>
                <div className="rowLabel">
                  <span className="rowTitle">
                    {typeof nodeTitle === 'function'
                      ? nodeTitle({
                          node,
                          path,
                          treeIndex,
                        })
                      : nodeTitle}
                  </span>
                </div>

                <div className="rowToolbar">
                  {buttons.map((btn, index) => (
                    <div
                      key={index} // eslint-disable-line react/no-array-index-key
                      className="toolbarButton"
                    >
                      {btn}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>,
        )} */}
      {/* </div> */}
    </div>
  );

  return canDrag
    ? connectDragSource(nodeContent, { dropEffect: 'copy' })
    : nodeContent;
};

export default FileThemeNodeContentRenderer;
