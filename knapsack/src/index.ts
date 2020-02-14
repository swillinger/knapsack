import * as log from './cli/log';
import * as utils from './server/server-utils';
import { initAll } from './cli/commands';
import { bootstrapFromConfigFile } from './lib/bootstrap';
import { KnapsackBrain } from './schemas/main-types';

export {
  styleDictionaryKnapsackFormat,
  theoKnapsackFormat,
} from '@knapsack/core';
export { knapsackEvents, EVENTS } from './server/events';
export { KnapsackRendererBase } from './server/renderer-base';
export { KnapsackRendererWebpackBase } from './server/renderer-webpack-base';

export { bootstrap, getBrain } from './lib/bootstrap';
export { log, utils, bootstrapFromConfigFile };

export async function bootstrapAndInit(
  configFilePath: string,
): Promise<KnapsackBrain> {
  const brain = bootstrapFromConfigFile(configFilePath);
  await initAll(brain);
  return brain;
}
