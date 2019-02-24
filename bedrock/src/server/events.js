const EventEmitter = require('events');
const util = require('util');
const log = require('../cli/log');

class BedrockEventEmitter extends EventEmitter {}

const bedrockEvents = new BedrockEventEmitter();
const EVENTS = {
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
  // each event should emit either nothing or a single object, no more
  bedrockEvents.on(EVENTS[event], info => {
    log.verbose(`event fired: ${EVENTS[event]}`, null, 'events');
    log.silly(
      '',
      util.inspect(info, {
        depth: 3,
      }),
      'events',
    );
  });
});

module.exports = {
  bedrockEvents,
  EVENTS,
};
