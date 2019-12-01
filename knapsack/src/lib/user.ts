export const saveClientToken = (token: string) =>
  window.localStorage.setItem('ks-github-token', token);
export const getClientToken = (): string =>
  window.localStorage.getItem('ks-github-token');
