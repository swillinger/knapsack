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
  // console.log('saving to local storage...');
  const state: AppState = store.getState();
  saveStateToLocalStorage(state);
  return next(action);
};
