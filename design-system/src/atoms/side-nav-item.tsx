import React from 'react';
import { NavLink } from 'react-router-dom';
import cn from 'classnames';
import './side-nav-item.scss';
import { Icon } from './icon';
import { KsButton } from './button';

type Btn = React.PropsWithoutRef<JSX.IntrinsicElements['button']>;

type Props = {
  isEditMode?: boolean;
  isDragging?: boolean;
  title: string;
  path?: string;
  active?: boolean;
  hasChildren?: boolean;
  isCollapsed?: boolean;
  onClickToggleCollapse?: Btn['onClick'];
  // @TODO: Replace statusColor with status component.
  statusColor?: string;
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
  statusColor,
}: Props) => {
  const classes = cn({
    'ks-side-nav-item': true,
    'ks-side-nav-item--clickable': path,
    'ks-side-nav-item--active': active,
    'ks-side-nav-item--editing': isEditMode,
    'ks-side-nav-item--dragging': isDragging,
  });

  return (
    <div className={classes}>
      {isEditMode && (
        <span className="ks-side-nav-item__drag-handle">
          <Icon symbol="drag-handle" size="s" />
        </span>
      )}

      {statusColor && (
        <div
          className="ks-side-nav-item__status-indicator"
          style={{ backgroundColor: statusColor }}
        />
      )}

      {hasChildren && !path ? (
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
        {path && !isEditMode ? (
          <NavLink to={path}>{title}</NavLink>
        ) : (
          <p>{title}</p>
        )}
        {isEditMode && (
          <div className="ks-side-nav-item__edit-title-btn">
            <KsButton kind="icon" size="s" icon="edit-text" flush>
              Edit Title
            </KsButton>
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
            onClick={onClickToggleCollapse}
          >
            {isCollapsed ? 'Expand' : 'Collapse'}
          </KsButton>
        </div>
      )}
    </div>
  );
};
