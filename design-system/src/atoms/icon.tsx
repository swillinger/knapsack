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
  'delete' = 'delete',
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
            <path d="M22.7142857,5.14285714 C23.0714286,5.14285714 23.375,5.26785714 23.625,5.51785714 C23.875,5.76785714 24,6.07142857 24,6.42857143 L24,22.7142857 C24,23.0714286 23.875,23.375 23.625,23.625 C23.375,23.875 23.0714286,24 22.7142857,24 L9.85714286,24 C9.5,24 9.19642857,23.875 8.94642857,23.625 C8.69642857,23.375 8.57142857,23.0714286 8.57142857,22.7142857 L8.57142857,18.8571429 L1.28571429,18.8571429 C0.928571429,18.8571429 0.625,18.7321429 0.375,18.4821429 C0.125,18.2321429 0,17.9285714 0,17.5714286 L0,8.57142857 C0,8.21428571 0.0892857143,7.82142857 0.267857143,7.39285714 C0.446428571,6.96428571 0.660714286,6.625 0.910714286,6.375 L6.375,0.910714286 C6.625,0.660714286 6.96428571,0.446428571 7.39285714,0.267857143 C7.82142857,0.0892857143 8.21428571,0 8.57142857,0 L14.1428571,0 C14.5,0 14.8035714,0.125 15.0535714,0.375 C15.3035714,0.625 15.4285714,0.928571429 15.4285714,1.28571429 L15.4285714,5.67857143 C16.0357143,5.32142857 16.6071429,5.14285714 17.1428571,5.14285714 L22.7142857,5.14285714 Z M15.4285714,7.99553571 L11.4241071,12 L15.4285714,12 L15.4285714,7.99553571 Z M6.85714286,2.85267857 L2.85267857,6.85714286 L6.85714286,6.85714286 L6.85714286,2.85267857 Z M9.48214286,11.5178571 L13.7142857,7.28571429 L13.7142857,1.71428571 L8.57142857,1.71428571 L8.57142857,7.28571429 C8.57142857,7.64285714 8.44642857,7.94642857 8.19642857,8.19642857 C7.94642857,8.44642857 7.64285714,8.57142857 7.28571429,8.57142857 L1.71428571,8.57142857 L1.71428571,17.1428571 L8.57142857,17.1428571 L8.57142857,13.7142857 C8.57142857,13.3571429 8.66071429,12.9642857 8.83928571,12.5357143 C9.01785714,12.1071429 9.23214286,11.7678571 9.48214286,11.5178571 Z M22.2857143,22.2857143 L22.2857143,6.85714286 L17.1428571,6.85714286 L17.1428571,12.4285714 C17.1428571,12.7857143 17.0178571,13.0892857 16.7678571,13.3392857 C16.5178571,13.5892857 16.2142857,13.7142857 15.8571429,13.7142857 L10.2857143,13.7142857 L10.2857143,22.2857143 L22.2857143,22.2857143 Z" />
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
