import { ThunkAction, ThunkMiddleware } from 'redux-thunk';
import { Action } from './types';
import { setStatus } from './ui';
import { getUserInfo } from '../../cloud/user-utils';
import { apiUrlBase } from '../../lib/constants';
import { KnapsackDataStoreSaveBody } from '../../schemas/misc';

type AppState = import('./index').AppState;

const SAVE_TO_SERVER_REQUEST = 'knapsack/meta/SAVE_TO_SERVER_REQUEST';
const SAVE_TO_SERVER_SUCCESS = 'knapsack/meta/SAVE_TO_SERVER_SUCCESS';
const SAVE_TO_SERVER_FAIL = 'knapsack/meta/SAVE_TO_SERVER_FAIL';

export interface MetaState {
  meta?: import('../../schemas/misc').KnapsackMeta;
}

const initialState: MetaState = {};

interface SaveToServerRequestAction extends Action {
  type: typeof SAVE_TO_SERVER_REQUEST;
}

interface SaveToServerSuccessAction extends Action {
  type: typeof SAVE_TO_SERVER_SUCCESS;
}

interface SaveToServerFailAction extends Action {
  type: typeof SAVE_TO_SERVER_FAIL;
}

type Actions =
  | SaveToServerRequestAction
  | SaveToServerSuccessAction
  | SaveToServerFailAction;

export function saveToServer({
  storageLocation,
  title,
  message,
}: Omit<KnapsackDataStoreSaveBody, 'state'>): ThunkAction<
  void,
  AppState,
  {},
  Actions
> {
  const showStatusMsgs = storageLocation === 'cloud';
  return async (dispatch, getState) => {
    dispatch({ type: SAVE_TO_SERVER_REQUEST });
    if (showStatusMsgs) {
      dispatch(
        setStatus({
          message: 'Saving...',
          type: 'info',
        }),
      );
    }
    const state = getState();
    const body: KnapsackDataStoreSaveBody = {
      storageLocation,
      state,
      title,
      message,
    };
    const { user, role, ksRepoAccess, token, username } = await getUserInfo();

    const userHeaders = user
      ? {
          Authorization: token ? `token ${token}` : null,
          'x-ks-cloud-role-id': role?.id,
          'x-ks-cloud-repo-access': ksRepoAccess?.join(','),
          'x-ks-cloud-username': username,
        }
      : {};

    return window
      .fetch(`${apiUrlBase}/data-store/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...userHeaders,
        },
        body: JSON.stringify(body),
      })
      .then(res => res.json())
      .then(async results => {
        if (!results.ok) {
          console.error('failed saveToServer', results);
          dispatch({ type: SAVE_TO_SERVER_FAIL });
          dispatch(
            setStatus({
              message: `Failed: ${results.message}`,
              type: 'error',
            }),
          );
        } else {
          dispatch({ type: SAVE_TO_SERVER_SUCCESS });
          if (showStatusMsgs) {
            dispatch(
              setStatus({
                message: `Success: ${results.message}`,
                type: 'success',
                dismissAfter: 30,
              }),
            );
          }
        }
        return results;
      });
  };
}

export default function reducer(
  state = initialState,
  action: Actions,
): MetaState {
  switch (action.type) {
    default:
      return {
        ...initialState,
        ...state,
      };
  }
}

let timeoutId: any;

export const autoSaveMiddleware: ThunkMiddleware<
  AppState,
  Actions
> = store => next => (action: Actions) => {
  const ignoredActionBases = ['knapsack/ui', 'knapsack/meta', 'knapsack/user'];
  if (ignoredActionBases.some(x => action.type.startsWith(x))) {
    return next(action);
  }
  const {
    isLocalDev,
    features: { autosave },
  } = store.getState().userState;
  if (!isLocalDev || !autosave) {
    return next(action);
  }
  /**
   * Ms after last action to autosave, if enabled
   */
  const autosaveDelay = action.meta?.autosaveDelay ?? 1500;
  if (autosaveDelay === -1) {
    // console.log('skipping');
    return next(action);
  }

  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    store.dispatch(
      saveToServer({
        storageLocation: 'local',
      }),
    );
    timeoutId = '';
  }, autosaveDelay);
  return next(action);
};
