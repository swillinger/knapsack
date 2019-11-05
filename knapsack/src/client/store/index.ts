import { combineReducers, compose, applyMiddleware } from 'redux';
import {
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
} from 'react-redux';
import thunk from 'redux-thunk';
import settingsState from './settings';
import patternsState from './patterns';
import userState from './user';
import metaState from './meta';

export const rootReducer = combineReducers({
  patternsState,
  settingsState,
  userState,
  metaState,
});

export type AppState = ReturnType<typeof rootReducer>;

/* eslint-disable no-underscore-dangle */
const composeEnhancers =
  typeof window === 'object' &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;
/* eslint-enable no-underscore-dangle */

export const rootEnhancer = composeEnhancers(applyMiddleware(thunk));

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
