import React from 'react';
import cn from 'classnames';
import './icon.scss';

export const sizes = ['s', 'm'];
export const symbols = [
  'add',
  'collapser',
  'delete',
  'drag-handle',
  'dropdown-carrot',
  'edit',
  'edit-text',
  'search',
  'settings',
  'sort-alphabetically',
];

export type Props = {
  size?: 's' | 'm';
  symbol?:
    | 'add'
    | 'collapser'
    | 'delete'
    | 'drag-handle'
    | 'dropdown-carrot'
    | 'edit'
    | 'edit-text'
    | 'search'
    | 'settings'
    | 'sort-alphabetically';
};

export const Icon: React.FC<Props> = ({
  size = 'm',
  symbol = 'edit',
}: Props) => {
  const classes = cn({
    'ks-icon': true,
    [`ks-icon--size-${size}`]: true,
  });

  const getSymbol = () => {
    let returnSymbol;

    switch (symbol) {
      case 'add':
        returnSymbol = (
          <g>
            <title>Add</title>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </g>
        );
        break;

      case 'collapser':
        returnSymbol = (
          <g>
            <title>Collapse / Expand</title>
            <polyline points="6 9 12 15 18 9" />
          </g>
        );
        break;

      case 'delete':
        returnSymbol = (
          <g>
            <title>Delete</title>
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </g>
        );
        break;

      case 'drag-handle':
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

      case 'dropdown-carrot':
        returnSymbol = (
          <g>
            <title>Dropdown Carrot</title>
            <path d="M12 15L5 9H19L12 15Z" fill="#222222" />
          </g>
        );
        break;

      case 'edit':
        returnSymbol = (
          <g>
            <title>Edit</title>
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </g>
        );
        break;

      case 'edit-text':
        returnSymbol = (
          <g>
            <title>Edit Text</title>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </g>
        );
        break;

      case 'search':
        returnSymbol = (
          <g>
            <title>Search</title>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </g>
        );
        break;

      case 'settings':
        returnSymbol = (
          <g>
            <title>Settings</title>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </g>
        );
        break;

      case 'sort-alphabetically':
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
