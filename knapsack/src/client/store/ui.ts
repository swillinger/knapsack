import { Action } from './types';

type StatusTypes = 'success' | 'info' | 'warning' | 'error';

const SET_STATUS = 'knapsack/ui/SET_STATUS';
const REMOVE_STATUS = 'knapsack/ui/REMOVE_STATUS';

type Status = {
  type: StatusTypes;
  message: string;
  dismissAfter?: number;
};

export interface UiState {
  status?: {
    type: StatusTypes;
    message: string;
    dismissAfter?: number;
  };
}

interface SetStatusAction extends Action {
  type: typeof SET_STATUS;
  payload: Status;
}

interface RemoveStatusAction extends Action {
  type: typeof REMOVE_STATUS;
}

type UiActionTypes = SetStatusAction | RemoveStatusAction;

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
    default:
      return {
        ...initialState,
        ...state,
      };
  }
}
