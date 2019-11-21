import { Action } from './types';

export interface UserState {
  role: import('../../server/auth').Role;
  canEdit: boolean;
  isLocalDev: boolean;
}

const initialState: UserState = {
  role: {
    id: 'anonymous',
    permissions: ['read'],
  },
  canEdit: false,
  isLocalDev: false,
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
