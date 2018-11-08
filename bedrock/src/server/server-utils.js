const fs = require('fs-extra');
const os = require('os');

/**
 * @param {string} fileName - path to where JSON file should be written
 * @param {Object} object - data to turn to JSON
 * @return {Promise}
 */
function writeJson(fileName, object) {
  return fs.writeFile(fileName, JSON.stringify(object, null, 2) + os.EOL);
}

module.exports = {
  writeJson,
};
