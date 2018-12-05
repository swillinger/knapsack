const globby = require('globby');
const { join } = require('path');
const fs = require('fs-extra');
const os = require('os');

/**
 * @param {string} fileName - path to where JSON file should be written
 * @param {Object} object - data to turn to JSON
 * @return {Promise<void>}
 */
function writeJson(fileName, object) {
  return fs.writeFile(fileName, JSON.stringify(object, null, 2) + os.EOL);
}

/**
 * Find readme path in directory
 * @param {string} dir - Path to directory
 * @return {Promise<string>} - path to readme file in that directory
 */
async function findReadmeInDir(dir) {
  const [readmePath = ''] = await globby(join(dir, '{readme,README}.{md,MD}'));
  return readmePath;
}

/**
 * Find readme path in directory, Synchronously
 * @param {string} dir - Path to directory
 * @return {string} - path to readme file in that directory
 */
function findReadmeInDirSync(dir) {
  const [readmePath = ''] = globby.sync(join(dir, '{readme,README}.{md,MD}'));
  return readmePath;
}

module.exports = {
  writeJson,
  findReadmeInDir,
  findReadmeInDirSync,
};
