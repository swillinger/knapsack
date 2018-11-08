const { default: chalk } = require('chalk');

const { log } = console;

/**
 * @param {string} msg
 * @returns {void}
 */
function error(msg) {
  log(chalk.red(msg));
}

/**
 * @param {string} msg
 * @returns {void}
 */
function info(msg) {
  log(chalk.blue(msg));
}

/**
 * @param {string} msg
 * @returns {void}
 */
function warning(msg) {
  log(chalk.yellow(msg));
}

/**
 * @param {string} msg
 * @returns {void}
 */
function success(msg) {
  log(chalk.green(msg));
}

/**
 * @param {string} msg
 * @returns {void}
 */
function dim(msg) {
  log(chalk.dim(msg));
}

module.exports = {
  error,
  info,
  warning,
  success,
  dim,
};
