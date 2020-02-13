import {
  createStore as createReduxStore,
  combineReducers,
  compose,
  applyMiddleware,
} from 'redux';
import {
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
  shallowEqual,
} from 'react-redux';
import thunk from 'redux-thunk';
import LogRocket from 'logrocket';
import deepEqual from 'deep-equal';
import { localStorageMiddleware } from './utils';
import settingsState from './settings';
import patternsState from './patterns';
import userState from './user';
import metaState, { autoSaveMiddleware } from './meta';
import ui from './ui';
import assetSetsState from './asset-sets';
import customPagesState from './custom-pages';
import navsState from './navs';

// export out all action creator functions
export * from './settings';
export * from './ui';
export { saveToServer } from './meta';
export * from './custom-pages';
export * from './patterns';
export * from './navs';
export * from './user';
// export * from './asset-sets';

export { useDispatch, shallowEqual } from 'react-redux';

const rootReducer = combineReducers({
  patternsState,
  settingsState,
  userState,
  metaState,
  customPagesState,
  assetSetsState,
  navsState,
  ui,
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

const rootEnhancer = composeEnhancers(
  applyMiddleware(
    thunk,
    localStorageMiddleware,
    autoSaveMiddleware,
    LogRocket.reduxMiddleware(),
  ),
);

/**
 * Custom Redux `useSelector` hook
 * Benefits: has appropriate types, and
 * a better default `equalityFn` - the default use `===`, we are using a shallowEqual (which is what `connect()` uses)
 * this is important b/c `{a: 1} !== {a: 1}` so many unnecessary re-renders occur
 * Original implementation was `export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;`
 */
export const useSelector: TypedUseSelectorHook<AppState> = (
  selectorFn,
  equalityFn = (a, b) => deepEqual(a, b),
) => {
  return useReduxSelector(selectorFn, equalityFn);
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createStore(initialState: AppState) {
  return createReduxStore(rootReducer, initialState, rootEnhancer);
}

export type StoreType = ReturnType<typeof createStore>;
