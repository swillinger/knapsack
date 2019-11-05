import { Action } from './types';

export interface UserState {
  role: import('../../server/auth').Role;
}

const initialState: UserState = {
  role: {
    id: 'anonymous',
    permissions: ['read'],
  },
};

export default function reducer(
  state = initialState,
  action: Action,
): UserState {
  switch (action.type) {
    default:
      return {
        ...initialState,
        ...state,
      };
  }
}
