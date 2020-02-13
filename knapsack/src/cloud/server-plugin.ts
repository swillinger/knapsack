import { KsServerPlugin } from '@knapsack/app/types';
import { KsCloudConfig } from '@knapsack/core/src/cloud';

export const configure = (config: KsCloudConfig): KsServerPlugin<null> => {
  return {
    id: 'ks-cloud',
  };
};
