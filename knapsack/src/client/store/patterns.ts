import produce from 'immer';
import { Action } from './types';
import {
  KnapsackPattern,
  KnapsackPatternsConfig,
} from '../../schemas/patterns';

type PatternsState = {
  isFetching?: boolean;
  didInvalidate?: boolean;
  patterns: {
    [id: string]: KnapsackPattern;
  };
  // nav: [];
} & KnapsackPatternsConfig;

const initialState: PatternsState = {
  isFetching: false,
  didInvalidate: false,
  patterns: {},
};

const UPDATE_PATTERN = 'knapsack/patterns/UPDATE_PATTERN';
const UPDATE_PATTERN_INFO = 'knapsack/patterns/UPDATE_PATTERN_INFO';

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

interface UpdatePatternInfoAction extends Action {
  type: typeof UPDATE_PATTERN_INFO;
  payload: Partial<KnapsackPattern>;
}

/**
 * Update basic Pattern Info
 * Basically everything besides `templates`
 */
export function updatePatternInfo(
  patternId: string,
  pattern: Partial<KnapsackPattern>,
): UpdatePatternInfoAction {
  return {
    type: UPDATE_PATTERN_INFO,
    payload: {
      id: patternId,
      ...pattern,
    },
  };
}

type Actions = UpdatePatternAction | UpdatePatternInfoAction;

export default function reducer(
  state = initialState,
  action: Actions,
): PatternsState {
  switch (action.type) {
    case UPDATE_PATTERN:
      return produce(state, draft => {
        draft.patterns[action.payload.id] = action.payload;
      });

    case UPDATE_PATTERN_INFO:
      return produce(state, draft => {
        const pattern = state.patterns[action.payload.id];
        draft.patterns[action.payload.id] = {
          ...pattern,
          ...action.payload,
          // can't change the below
          templates: pattern.templates,
          id: pattern.id,
        };
      });

    default:
      return {
        ...initialState,
        ...state,
      };
  }
}
