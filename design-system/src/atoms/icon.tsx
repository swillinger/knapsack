import React from 'react';
import cn from 'classnames';
import './icon.scss';

export enum IconSizes {
  's' = 's',
  'm' = 'm',
}

// Keep this alphabetical
export enum Icons {
  'add' = 'add',
  'close' = 'close',
  'collapser' = 'collapser',
  'copy' = 'copy',
  'duplicate' = 'duplicate',
  'delete' = 'delete',
  'down' = 'down',
  'drag-handle' = 'drag-handle',
  'dropdown-carrot' = 'dropdown-carrot',
  'edit-text' = 'edit-text',
  'edit' = 'edit',
  'external-link' = 'external-link',
  'folder' = 'folder',
  'info' = 'info',
  'save' = 'save',
  'search' = 'search',
  'settings' = 'settings',
  'sort-alphabetically' = 'sort-alphabetically',
  'grid-view' = 'grid-view',
  'table-view' = 'table-view',
  'up' = 'up',
}

export type Props = {
  size?: keyof typeof IconSizes;
  symbol: keyof typeof Icons;
};

export const Icon: React.FC<Props> = ({
  size = IconSizes.m,
  symbol = Icons.edit,
}: Props) => {
  const classes = cn({
    'ks-icon': true,
    [`ks-icon--size-${size}`]: true,
  });

  const getSymbol = () => {
    let returnSymbol: React.ReactNode;

    switch (symbol) {
      case Icons.add:
        returnSymbol = (
          <g>
            <title>Add</title>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </g>
        );
        break;

      case Icons.collapser:
        returnSymbol = (
          <g>
            <title>Collapse / Expand</title>
            <polyline points="6 9 12 15 18 9" />
          </g>
        );
        break;

      case Icons.delete:
        returnSymbol = (
          <g
            style={{
              stroke: 'var(--c-button-primary-danger)',
            }}
          >
            <title>Delete</title>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </g>
        );
        break;

      case Icons.close:
        returnSymbol = (
          <g>
            <title>Close or Cancel</title>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </g>
        );
        break;

      case Icons.save:
        returnSymbol = (
          <g>
            <title>Save</title>
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </g>
        );
        break;

      case Icons['drag-handle']:
        returnSymbol = (
          <g>
            <title>Drag Handle</title>
            <path d="M8 13C8.55228 13 9 12.5523 9 12C9 11.4477 8.55228 11 8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13Z" />
            <path d="M8 6C8.55228 6 9 5.55228 9 5C9 4.44772 8.55228 4 8 4C7.44772 4 7 4.44772 7 5C7 5.55228 7.44772 6 8 6Z" />
            <path d="M8 20C8.55228 20 9 19.5523 9 19C9 18.4477 8.55228 18 8 18C7.44772 18 7 18.4477 7 19C7 19.5523 7.44772 20 8 20Z" />
            <path d="M16 13C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11C15.4477 11 15 11.4477 15 12C15 12.5523 15.4477 13 16 13Z" />
            <path d="M16 6C16.5523 6 17 5.55228 17 5C17 4.44772 16.5523 4 16 4C15.4477 4 15 4.44772 15 5C15 5.55228 15.4477 6 16 6Z" />
            <path d="M16 20C16.5523 20 17 19.5523 17 19C17 18.4477 16.5523 18 16 18C15.4477 18 15 18.4477 15 19C15 19.5523 15.4477 20 16 20Z" />
          </g>
        );
        break;

      case Icons['dropdown-carrot']:
        returnSymbol = (
          <g>
            <title>Dropdown Carrot</title>
            <path d="M12 15L5 9H19L12 15Z" fill="#222222" />
          </g>
        );
        break;

      case Icons.edit:
        returnSymbol = (
          <g>
            <title>Edit</title>
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </g>
        );
        break;

      case Icons['edit-text']:
        returnSymbol = (
          <g>
            <title>Edit Text</title>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </g>
        );
        break;

      case Icons.search:
        returnSymbol = (
          <g>
            <title>Search</title>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </g>
        );
        break;

      case Icons.settings:
        returnSymbol = (
          <g>
            <title>Settings</title>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </g>
        );
        break;

      case Icons['sort-alphabetically']:
        returnSymbol = (
          <g>
            <title>Sort Alphabetically</title>
            <path d="M3 10L6.5 2L10 10" />
            <path d="M3.5 8H9.5" />
            <path d="M3 14H10L3 21H10" />
            <path d="M18 5V18M18 18L15 15.5M18 18L21 15.5" />
          </g>
        );
        break;

      case Icons.folder:
        returnSymbol = (
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        );
        break;

      case Icons['external-link']:
        returnSymbol = (
          <g>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </g>
        );
        break;

      case 'info':
        returnSymbol = (
          <g>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </g>
        );
        break;

      case Icons.copy:
        returnSymbol = (
          <g>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </g>
        );
        break;

      case Icons.duplicate:
        returnSymbol = (
          <g>
            <path d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z" />
            <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" />
            <path d="M15.5 13.5V17.5" />
            <path d="M13.5 15.5L17.5 15.5" />
          </g>
        );
        break;

      case Icons['grid-view']:
        returnSymbol = (
          <g>
            <path d="M10 3H3V10H10V3Z" />
            <path d="M21 3H14V10H21V3Z" />
            <path d="M21 14H14V21H21V14Z" />
            <path d="M10 14H3V21H10V14Z" />
          </g>
        );
        break;

      case Icons['table-view']:
        returnSymbol = (
          <g>
            <rect x="3" y="3" width="18" height="18" />
            <path d="M3 9H21" />
            <path d="M3 15H21" />
          </g>
        );
        break;

      case Icons.up:
        returnSymbol = (
          <g>
            <path
              d="M12 19V5"
              stroke="#222222"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 12L12 5L19 12"
              stroke="#222222"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );
        break;

      case Icons.down:
        returnSymbol = (
          <g>
            <path
              d="M12 5L12 19"
              stroke="#222222"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 12L12 19L5 12"
              stroke="#222222"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );
        break;

      default:
        returnSymbol = (
          <g>
            <text y="12">N/A</text>
          </g>
        );
        break;
    }

    return returnSymbol;
  };

  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      {getSymbol()}
    </svg>
  );
};
