import EventEmitter from 'events';
import util from 'util';
import * as log from '../cli/log';
import { EVENTS } from '../lib/constants';
import { KnapsackPattern } from '../schemas/patterns';

export { EVENTS } from '../lib/constants';

class KnapsackEventEmitter extends EventEmitter {}

export const knapsackEvents = new KnapsackEventEmitter();

export interface KnapsackEventsData {
  PATTERNS_DATA_READY: KnapsackPattern[];
}

export function emitPatternsDataReady(
  patterns: KnapsackEventsData['PATTERNS_DATA_READY'],
): void {
  knapsackEvents.emit(EVENTS.PATTERNS_DATA_READY, patterns);
}

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
