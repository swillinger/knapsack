import { KsServerPlugin } from '@knapsack/app/types';

/**
 * This is made for the app itself to tap into the plugin lifecycle methods
 */
export const configure = (): KsServerPlugin<null> => {
  return {
    id: 'ks-app',
  };
};
