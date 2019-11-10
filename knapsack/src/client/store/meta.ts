import { Action } from './types';
import { setStatus } from './ui';
import { apiUrlBase } from '../../lib/constants';

const SAVE_TO_SERVER_REQUEST = 'knapsack/meta/SAVE_TO_SERVER_REQUEST';
const SAVE_TO_SERVER_SUCCESS = 'knapsack/meta/SAVE_TO_SERVER_SUCCESS';
const SAVE_TO_SERVER_FAIL = 'knapsack/meta/SAVE_TO_SERVER_FAIL';

export interface MetaState {
  meta: import('../../schemas/misc').KnapsackMeta;
}

interface SaveToServerRequestAction extends Action {
  type: typeof SAVE_TO_SERVER_REQUEST;
}

export function saveToServer() {
  return (dispatch, getState) => {
    dispatch({ type: SAVE_TO_SERVER_REQUEST });
    dispatch(
      setStatus({
        message: 'Saving...',
        type: 'info',
      }),
    );
    const state = getState();
    window
      .fetch(`${apiUrlBase}/data-store`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state),
      })
      .then(async res => {
        if (!res.ok) {
          console.error('failed saveToServer', res.statusText, res.status);
          dispatch({ type: SAVE_TO_SERVER_FAIL });
          dispatch(
            setStatus({
              message: `Failed: ${res.statusText}`,
              type: 'error',
            }),
          );
        } else {
          const results = await res.json();
          dispatch({ type: SAVE_TO_SERVER_SUCCESS });
          dispatch(
            setStatus({
              message: `Success: ${results.message}`,
              type: 'success',
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
