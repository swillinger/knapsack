import { Action } from './types';

export interface MetaState {
  meta: import('../../schemas/misc').KnapsackMeta;
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
