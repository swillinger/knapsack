import EventEmitter from 'events';
import util from 'util';
import * as log from '../cli/log';

class KnapsackEventEmitter extends EventEmitter {}

export const knapsackEvents = new KnapsackEventEmitter();
export const EVENTS = {
  CONFIG_READY: 'CONFIG_READY',
  PATTERNS_DATA_READY: 'PATTERNS_DATA_READY',
  PATTERN_TEMPLATE_ADDED: 'PATTERN_TEMPLATE_ADDED',
  PATTERN_TEMPLATE_CHANGED: 'PATTERN_TEMPLATE_CHANGED',
  PATTERN_TEMPLATE_REMOVED: 'PATTERN_TEMPLATE_REMOVED',
  PATTERN_ASSET_CHANGED: 'PATTERN_ASSET_CHANGED',
  PATTERN_CONFIG_CHANGED: 'PATTERN_CONFIG_CHANGED',
  SHUTDOWN: 'SHUTDOWN',
};

Object.keys(EVENTS).forEach(event => {
  const eventName = EVENTS[event];
  // each event should emit either nothing or a single object, no more
  knapsackEvents.on(eventName, info => {
    log.verbose(`event fired: ${eventName}`, null, 'events');
    log.silly(
      '',
      util.inspect(info, {
        depth: 3,
      }),
      'events',
    );
  });
});
