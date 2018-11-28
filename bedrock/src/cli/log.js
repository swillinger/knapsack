const log = require('npmlog'); // https://www.npmjs.com/package/npmlog

/**
 * @param {string} level - one of: error, warn, http, info, verbose, silly
 * @returns {void}
 */
function setLogLevel(level) {
  log.level = level;
}

setLogLevel('info');

/**
 * @param {string} msg
 * @param {Object|[]} [extra]
 * @param {string} [prefix=''] - Logging prefix
 * @returns {void}
 */
function error(msg, extra, prefix = '') {
  if (extra) {
    log.error(prefix, msg, extra);
  } else {
    log.error(prefix, msg);
  }
}

/**
 * @param {string} msg
 * @param {Object|[]} [extra]
 * @param {string} [prefix=''] - Logging prefix
 * @returns {void}
 */
function info(msg, extra, prefix = '') {
  if (extra) {
    log.info(prefix, msg, extra);
  } else {
    log.info(prefix, msg);
  }
}

/**
 * @param {string} msg
 * @param {Object|[]} [extra]
 * @param {string} [prefix=''] - Logging prefix
 * @returns {void}
 */
function warn(msg, extra, prefix = '') {
  if (extra) {
    log.warn(prefix, msg, extra);
  } else {
    log.warn(prefix, msg);
  }
}

/**
 * @param {string} msg
 * @param {Object|[]} [extra]
 * @param {string} [prefix=''] - Logging prefix
 * @returns {void}
 */
function verbose(msg, extra, prefix = '') {
  if (extra) {
    log.verbose(prefix, msg, extra);
  } else {
    log.verbose(prefix, msg);
  }
}

/**
 * @param {string} msg
 * @param {Object|[]} [extra]
 * @param {string} [prefix=''] - Logging prefix
 * @returns {void}
 */
function silly(msg, extra, prefix = '') {
  if (extra) {
    log.silly(prefix, msg, extra);
  } else {
    log.silly(prefix, msg);
  }
}

module.exports = {
  error,
  info,
  warn,
  verbose,
  silly,
  setLogLevel,
};
