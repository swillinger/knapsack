import React from 'react';
import { NodeRendererProps, TreeItem } from 'react-sortable-tree';
import { SideNavItem } from '@knapsack/design-system';
import './node-content-renderer.scss';
import {
  useSelector,
  useDispatch,
  deleteNavItem,
  deletePattern,
  deletePage,
} from '../../../store';
import { getPatternInfoFromUrl } from '../../../../lib/routes';
import { BASE_PATHS } from '../../../../lib/constants';

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
  const showNonFunctioningUi = useSelector(
    s => s.userState.features?.showNonFunctioningUi,
  );
  const { canEdit } = useSelector(s => s.userState);
  const patterns = useSelector(s => s.patternsState.patterns);
  const globalStatuses = useSelector(s => s.patternsState.templateStatuses);
  const patternIds = Object.keys(patterns);
  const renderers = useSelector(s => s.patternsState.renderers);
  const dispatch = useDispatch();
  const patternInfo = getPatternInfoFromUrl(ksNavItem?.path);
  let pattern: KnapsackPattern;
  if (patternInfo !== false) {
    pattern = patterns[patternInfo.patternId];
  }
  const statuses = pattern
    ? pattern.templates.map(template => {
        const { statusId, id: templateId, templateLanguageId } = template;
        return {
          status: statusId ? globalStatuses.find(s => s.id === statusId) : null,
          templateId,
          templateLanguageId,
          templateLanguageTitle: renderers[templateLanguageId]?.meta?.title,
          path: `${BASE_PATHS.PATTERN}/${pattern.id}/${templateId}`,
        };
      })
    : null;
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
      {scaffold}
      <div className="node-content__inner">
        <SideNavItem
          title={ksNavItem.name}
          canEditTitle={showNonFunctioningUi}
          canDelete={canEdit}
          statuses={statuses}
          isEditMode={isSidebarEditMode}
          hasChildren={
            toggleChildrenVisibility &&
            node.children &&
            node.children.length > 0
          }
          isCollapsed={!node.expanded}
          handleDelete={() => {
            // is group
            if (!node.path) {
              dispatch(
                deleteNavItem({
                  id: node.id,
                  nav: 'secondary',
                }),
              );
            }

            // is pattern
            if (node?.path?.startsWith(`${BASE_PATHS.PATTERN}/`)) {
              const [_, base, patternId] = node.path.split('/');
              if (!patternIds.includes(patternId)) {
                console.error({ patternId, patternIds });
                throw new Error(
                  `Cannot delete patternId "${patternId}" b/c it is not in the list of patterns`,
                );
              }
              dispatch(
                deletePattern({
                  patternId,
                }),
              );
            }

            // is page
            if (node?.path?.startsWith(`${BASE_PATHS.PAGES}/`)) {
              const [_, base, pageId] = node.path.split('/');
              dispatch(deletePage({ id: pageId }));
            }
          }}
          handleEdit={opt => {
            // @todo
          }}
          onClickToggleCollapse={() =>
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
    </div>
  );

  return canDrag
    ? connectDragSource(nodeContent, { dropEffect: 'copy' })
    : nodeContent;
};

export default FileThemeNodeContentRenderer;
