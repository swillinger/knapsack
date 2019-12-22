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

type UiActionTypes = SetStatusAction | RemoveStatusAction | SetTemplateRenderer;

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
    case SET_TEMPLATE_RENDERER:
      return {
        ...state,
        currentTemplateRenderer: action.payload.id,
      };
    default:
      return {
        ...initialState,
        ...state,
      };
  }
}
