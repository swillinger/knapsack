import { Action } from './types';

type StatusTypes = 'success' | 'info' | 'warning' | 'error';

const SET_STATUS = 'knapsack/ui/SET_STATUS';
const SET_TEMPLATE_RENDERER = 'knapsack/ui/SET_TEMPLATE_RENDERER';
const REMOVE_STATUS = 'knapsack/ui/REMOVE_STATUS';

type Status = {
  type: StatusTypes;
  /**
   * Can contain markdown
   */
  message: string;
  /**
   * After x seconds, remove
   */
  dismissAfter?: number;
};

export interface UiState {
  status?: {
    type: StatusTypes;
    message: string;
    dismissAfter?: number;
  };
  currentTemplateRenderer?: string;
  sidebarOpen?: boolean;
  /**
   * Is right sidebar open?
   */
  pageDetailsOpen?: boolean;
}

const SET_PAGE_DETAILS_VISIBILITY = 'knapsack/ui/SET_PAGE_DETAILS_VISIBILITY';
interface SetPageDetailsVisibilityAction extends Action {
  type: typeof SET_PAGE_DETAILS_VISIBILITY;
  payload: {
    isOpen: boolean;
  };
}
export function setPageDetailsVisibility(
  payload: SetPageDetailsVisibilityAction['payload'],
): SetPageDetailsVisibilityAction {
  return {
    type: SET_PAGE_DETAILS_VISIBILITY,
    payload,
  };
}

const SET_SIDEBAR_VISIBILITY = 'knapsack/ui/Set sidebar visibility';
interface SetSidebarVisibilityAction extends Action {
  type: typeof SET_SIDEBAR_VISIBILITY;
  payload: {
    isOpen: boolean;
  };
}
export function setSidebarVisibility(
  payload: SetSidebarVisibilityAction['payload'],
): SetSidebarVisibilityAction {
  return {
    type: SET_SIDEBAR_VISIBILITY,
    payload,
  };
}

interface SetTemplateRenderer extends Action {
  type: typeof SET_TEMPLATE_RENDERER;
  payload: {
    id: string;
  };
}

export function setCurrentTemplateRenderer({
  id,
}: {
  id: string;
}): SetTemplateRenderer {
  return {
    type: SET_TEMPLATE_RENDERER,
    payload: {
      id,
    },
  };
}

interface SetStatusAction extends Action {
  type: typeof SET_STATUS;
  payload: Status;
}

interface RemoveStatusAction extends Action {
  type: typeof REMOVE_STATUS;
}

export function removeStatus(): RemoveStatusAction {
  return {
    type: REMOVE_STATUS,
  };
}

export function setStatus(status: Status) {
  return dispatch => {
    if (status.dismissAfter) {
      setTimeout(() => {
        dispatch(removeStatus());
      }, status.dismissAfter * 1000);
    }
    dispatch({
      type: SET_STATUS,
      payload: status,
    });
  };
}

const initialState: UiState = {
  pageDetailsOpen: true,
  sidebarOpen: true,
};

type UiActionTypes =
  | SetStatusAction
  | RemoveStatusAction
  | SetTemplateRenderer
  | SetPageDetailsVisibilityAction
  | SetSidebarVisibilityAction;

export default function reducer(
  state = initialState,
  action: UiActionTypes,
): UiState {
  switch (action.type) {
    case SET_STATUS:
      return {
        ...state,
        status: action.payload,
      };
    case REMOVE_STATUS:
      return {
        ...state,
        status: null,
      };
    case SET_TEMPLATE_RENDERER:
      return {
        ...state,
        currentTemplateRenderer: action.payload.id,
      };
    case SET_SIDEBAR_VISIBILITY:
      return {
        ...state,
        sidebarOpen: action.payload.isOpen,
      };
    case SET_PAGE_DETAILS_VISIBILITY:
      return {
        ...state,
        pageDetailsOpen: action.payload.isOpen,
      };
    default:
      return {
        ...initialState,
        ...state,
      };
  }
}
