import produce from 'immer';
import { Action } from './types';
import {
  KnapsackPattern,
  KnapsackPatternsConfig,
} from '../../schemas/patterns';

type PatternsState = {
  isFetching?: boolean;
  didInvalidate?: boolean;
  // patternStatuses?: import('../../schemas/patterns').KnapsackPatternStatus[];
  // patternTypes?: import('../../schemas/patterns').KnapsackPatternType[];
  // patterns: import('../../schemas/patterns').KnapsackPattern[];
  patterns: {
    [id: string]: KnapsackPattern;
  };
  // nav: [];
} & KnapsackPatternsConfig;

const UPDATE_PATTERN = 'knapsack/patterns/UPDATE_PATTERN';

interface UpdatePatternAction extends Action {
  type: typeof UPDATE_PATTERN;
  payload: KnapsackPattern;
}

export function updatePattern(pattern: KnapsackPattern): UpdatePatternAction {
  return {
    type: UPDATE_PATTERN,
    payload: pattern,
  };
}

const initialState: PatternsState = {
  isFetching: false,
  didInvalidate: false,
  patterns: {},
  // patternTypes: [],
  // patternStatuses: [],
};

type Actions = UpdatePatternAction;

export default function reducer(
  state = initialState,
  action: Actions,
): PatternsState {
  switch (action.type) {
    case UPDATE_PATTERN:
      return produce(state, draft => {
        draft.patterns[action.payload.id] = action.payload;
      });
    default:
      return {
        ...initialState,
        ...state,
      };
  }
}
