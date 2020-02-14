import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import cn from 'classnames';
import { KnapsackTemplateStatus } from '@knapsack/core/types';
import './side-nav-item.scss';
import { Icon } from './icon';
import { KsButton } from './button';
import { KsPopover } from '../popover/popover';
import { StatusIcon } from './status-icon';
import { KsDeleteButton } from './delete-button';

type Btn = React.PropsWithoutRef<JSX.IntrinsicElements['button']>;

type Props = {
  isEditMode?: boolean;
  isDragging?: boolean;
  canEditTitle?: boolean;
  title: string;
  path?: string;
  active?: boolean;
  hasChildren?: boolean;
  isCollapsed?: boolean;
  onClickToggleCollapse?: () => void;
  isSearchMatch?: boolean;
  isSearchFocus?: boolean;
  canDelete?: boolean;
  statuses?: {
    status: KnapsackTemplateStatus;
    templateId: string;
    templateLanguageId: string;
    templateLanguageTitle: string;
    path: string;
  }[];
  handleDelete: () => void;
  handleEdit: (opt: { path: string; title: string }) => void;
};

export const SideNavItem: React.FC<Props> = ({
  isEditMode = false,
  isDragging,
  title,
  path,
  active,
  hasChildren,
  isCollapsed,
  onClickToggleCollapse,
  statuses,
  isSearchMatch,
  isSearchFocus,
  canEditTitle,
  handleDelete,
  handleEdit,
  canDelete,
}: Props) => {
  const classes = cn({
    'ks-side-nav-item': true,
    'ks-side-nav-item--clickable': path,
    'ks-side-nav-item--active': active,
    'ks-side-nav-item--editing': isEditMode,
    'ks-side-nav-item--dragging': isDragging,
    'ks-side-nav-item--is-search-match': isSearchMatch,
    'ks-side-nav-item--is-search-focus': isSearchFocus,
  });

  return (
    <div className={classes}>
      {isEditMode && (
        <span className="ks-side-nav-item__drag-handle">
          <Icon symbol="drag-handle" size="s" />
        </span>
      )}

      {statuses?.length > 0 && (
        <>
          {statuses.map(statusItem => {
            return (
              statusItem.status && (
                <KsPopover
                  key={`${statusItem.templateLanguageId}-${statusItem.status.id}`}
                  trigger="hover"
                  content={
                    <span>
                      {statuses.length > 1 ? (
                        <>
                          {statusItem.templateLanguageTitle} Template Status:{' '}
                        </>
                      ) : (
                        <>Status: </>
                      )}
                      <strong>{statusItem.status.title}</strong>
                    </span>
                  }
                >
                  <Link to={statusItem.path}>
                    <StatusIcon status={statusItem.status} />
                  </Link>
                </KsPopover>
              )
            );
          })}
        </>
      )}

      {!path ? (
        <div className="ks-side-nav-item__folder-icon">
          <Icon symbol="folder" size="s" />
        </div>
      ) : (
        ''
      )}

      <div
        className={cn(
          'ks-side-nav-item__title-container',
          hasChildren ? 'ks-side-nav-item__title-container--has-children' : '',
        )}
      >
        <div className="ks-side-nav-item__title-container__title">
          {path && !isEditMode ? (
            <NavLink to={path}>{title}</NavLink>
          ) : (
            <p>{title}</p>
          )}
        </div>
        {/* @todo wire up save functionality */}
        {canEditTitle && isEditMode && (
          <div className="ks-side-nav-item__edit-title-btn">
            <KsButton
              handleTrigger={() => handleEdit({ path, title })}
              kind="icon"
              size="s"
              icon="edit-text"
              flush
            >
              Edit Title
            </KsButton>
          </div>
        )}

        {canDelete && isEditMode && (
          <div className="ks-side-nav-item__actions">
            <KsDeleteButton
              confirmationMessage={
                <div>
                  <p>
                    Are you sure you want to delete the <strong>{title}</strong>{' '}
                    pattern?
                  </p>
                  <p>
                    <em>
                      This can not be undone or even recovered by canceling
                      navigation edits.
                    </em>
                  </p>
                </div>
              }
              size="s"
              flush
              handleTrigger={handleDelete}
            />
          </div>
        )}
      </div>

      {hasChildren && (
        <div
          className={cn({
            'ks-side-nav-item__collapse-btn': true,
            'ks-side-nav-item__collapse-btn--collapsed': isCollapsed,
          })}
        >
          <KsButton
            kind="icon"
            icon="collapser"
            handleTrigger={onClickToggleCollapse}
            flush
          >
            {isCollapsed ? 'Expand' : 'Collapse'}
          </KsButton>
        </div>
      )}
    </div>
  );
};
