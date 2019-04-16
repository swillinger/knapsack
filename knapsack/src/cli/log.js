/**
 *  Copyright (C) 2018 Basalt
    This file is part of Knapsack.
    Knapsack is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Knapsack is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Knapsack; if not, see <https://www.gnu.org/licenses>.
 */
const log = require('npmlog'); // https://www.npmjs.com/package/npmlog

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

/**
 * @param {string} level - one of: error, warn, http, info, verbose, silly
 * @returns {void}
 */
function setLogLevel(level) {
  info(`Setting loglevel to ${level}`);
  log.level = level;
}

setLogLevel(process.env.knapsack_LOG_LEVEL || 'info');

module.exports = {
  error,
  info,
  warn,
  verbose,
  silly,
  setLogLevel,
};
