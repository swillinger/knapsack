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

export const rootEnhancer = compose(
  applyMiddleware(thunk),
  /* eslint-disable no-underscore-dangle */
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
  /* eslint-enable no-underscore-dangle */
);

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
