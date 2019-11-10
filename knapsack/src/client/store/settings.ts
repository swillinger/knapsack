import produce from 'immer';
import { Action } from './types';
import { apiUrlBase } from '../../lib/constants';
import { KnapsackSettings } from '../../schemas/knapsack.settings';

const REQUEST = 'knapsack/settings/REQUEST';
const RECEIVE = 'knapsack/settings/RECEIVE';
const UPDATE = 'knapsack/settings/UPDATE';

export interface SettingsState {
  isFetching?: boolean;
  didInvalidate?: boolean;
  settings: KnapsackSettings;
}

const initialState: SettingsState = {
  isFetching: false,
  didInvalidate: false,
  settings: {
    title: 'A New Design System',
  },
};

interface RequestSettingsAction extends Action {
  type: typeof REQUEST;
}

interface ReceiveSettingsAction extends Action {
  type: typeof RECEIVE;
  payload: KnapsackSettings;
}

interface UpdateSettingsAction extends Action {
  type: typeof UPDATE;
  payload: KnapsackSettings;
}

export type SettingsActionTypes =
  | ReceiveSettingsAction
  | RequestSettingsAction
  | UpdateSettingsAction;

function requestSettings(): SettingsActionTypes {
  return {
    type: REQUEST,
  };
}

function receiveSettings(settings: KnapsackSettings): SettingsActionTypes {
  return {
    type: RECEIVE,
    payload: settings,
  };
}

export function updateSettings(
  settings: KnapsackSettings,
): UpdateSettingsAction {
  return {
    type: UPDATE,
    payload: settings,
  };
}

function fetchSettings() {
  return dispatch => {
    dispatch(requestSettings());
    return window
      .fetch(`${apiUrlBase}/settings`)
      .then(
        res => res.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => console.error('An error occurred in "fetchSettings"', error),
      )
      .then(settings => dispatch(receiveSettings(settings)));
  };
}

function shouldFetchSettings(state: SettingsState): boolean {
  if (!state.settings) {
    return true;
  }
  if (state.isFetching) {
    return false;
  }
  return state.didInvalidate;
}

export function fetchSettingsIfNeeded() {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    if (shouldFetchSettings(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(fetchSettings());
    }
    // Let the calling code know there's nothing to wait for.
    return Promise.resolve();
  };
}

export default function reducer(
  state = initialState,
  action: SettingsActionTypes,
): SettingsState {
  switch (action.type) {
    case REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE:
      return {
        ...state,
        isFetching: false,
        settings: action.payload,
      };
    case UPDATE:
      return produce(state, draft => {
        draft.settings = action.payload;
      });
    default:
      return {
        ...initialState,
        ...state,
      };
  }
}
