import { Action } from './types';
import { setStatus } from './ui';
import { getUserInfo } from '../../cloud/user-utils';
import { apiUrlBase } from '../../lib/constants';
import { KnapsackDataStoreSaveBody } from '../../schemas/misc';

const SAVE_TO_SERVER_REQUEST = 'knapsack/meta/SAVE_TO_SERVER_REQUEST';
const SAVE_TO_SERVER_SUCCESS = 'knapsack/meta/SAVE_TO_SERVER_SUCCESS';
const SAVE_TO_SERVER_FAIL = 'knapsack/meta/SAVE_TO_SERVER_FAIL';

export interface MetaState {
  meta: import('../../schemas/misc').KnapsackMeta;
}

interface SaveToServerRequestAction extends Action {
  type: typeof SAVE_TO_SERVER_REQUEST;
}

export function saveToServer({
  storageLocation,
  title,
  message,
}: Omit<KnapsackDataStoreSaveBody, 'state'>) {
  return async (dispatch, getState) => {
    dispatch({ type: SAVE_TO_SERVER_REQUEST });
    dispatch(
      setStatus({
        message: 'Saving...',
        type: 'info',
      }),
    );
    const state: import('./').AppState = getState();
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

    window
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
          // const results = await res.json();
          dispatch({ type: SAVE_TO_SERVER_SUCCESS });
          dispatch(
            setStatus({
              message: `Success: ${results.message}`,
              type: 'success',
              dismissAfter: 5,
            }),
          );
        }
      });
  };
}

const initialState: MetaState = {
  meta: {},
};

export default function reducer(
  state = initialState,
  action: Action,
): MetaState {
  switch (action.type) {
    default:
      return {
        ...initialState,
        ...state,
      };
  }
}
