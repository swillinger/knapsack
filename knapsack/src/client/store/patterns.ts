import { Action } from './types';

export interface PatternsState {
  isFetching?: boolean;
  didInvalidate?: boolean;
  patternStatuses?: import('../../schemas/patterns').KnapsackPatternStatus[];
  patternTypes?: import('../../schemas/patterns').KnapsackPatternType[];
  patterns: import('../../schemas/patterns').KnapsackPattern[];
}

const initialState: PatternsState = {
  isFetching: false,
  didInvalidate: false,
  patterns: [],
};

export default function reducer(
  state = initialState,
  action: Action,
): PatternsState {
  switch (action.type) {
    default:
      return {
        ...initialState,
        ...state,
      };
  }
}
