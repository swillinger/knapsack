import { Action } from './types';

type StatusTypes = 'success' | 'info' | 'warning' | 'error';

const SET_STATUS = 'knapsack/ui/SET_STATUS';
const REMOVE_STATUS = 'knapsack/ui/REMOVE_STATUS';
const ENABLE_EDIT_MODE = 'knapsack/ui/ENABLE_EDIT_MODE';
const DISABLE_EDIT_MODE = 'knapsack/ui/DISABLE_EDIT_MODE';

type Status = {
  type: StatusTypes;
  message: string;
  dismissAfter?: number;
};

interface SetStatusAction extends Action {
  type: typeof SET_STATUS;
  payload: Status;
}

interface RemoveStatusAction extends Action {
  type: typeof REMOVE_STATUS;
}

interface EnableEditModeAction extends Action {
  type: typeof ENABLE_EDIT_MODE;
}

export function enableEditMode(): EnableEditModeAction {
  return {
    type: ENABLE_EDIT_MODE,
  };
}

interface DisableEditModeAction extends Action {
  type: typeof DISABLE_EDIT_MODE;
}

export function disableEditMode(): DisableEditModeAction {
  return {
    type: DISABLE_EDIT_MODE,
  };
}

type UiActionTypes =
  | SetStatusAction
  | RemoveStatusAction
  | EnableEditModeAction
  | DisableEditModeAction;

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

export interface UiState {
  status?: {
    type: StatusTypes;
    message: string;
    dismissAfter?: number;
  };
  isEditMode?: boolean;
}

const initialState: UiState = {};

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
    case ENABLE_EDIT_MODE:
      return {
        ...state,
        isEditMode: true,
      };
    case DISABLE_EDIT_MODE:
      return {
        ...state,
        isEditMode: false,
      };
    default:
      return {
        ...initialState,
        ...state,
      };
  }
}
