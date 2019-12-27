import { Middleware } from 'redux';

type AppState = import('./index').AppState;

const key = 'knapsack-store';
export function saveStateToLocalStorage(state: AppState): void {
  window.localStorage.setItem(key, JSON.stringify(state));
}

export function getStateFromLocalStorage(): AppState | false {
  const string = window.localStorage.getItem(key);
  if (!string) return false;
  return JSON.parse(string);
}

export const localStorageMiddleware: Middleware = store => next => action => {
  // we want to run after the state has been update from whatever action triggered this, so we run on the next stack
  setTimeout(() => {
    // console.log('saving to local storage...');
    const state: AppState = store.getState();
    saveStateToLocalStorage(state);
  }, 0);
  return next(action);
};
