const fs = require('fs-extra');
const path = require('path');
const os = require('os');

/**
 * Sync Write Json
 * @param {string} fileName - path to file name of JSON file
 * @param {Object} object - Object to stringify and write
 * @returns {void}
 */
function writeJson(fileName, object) {
  fs.writeFileSync(fileName, JSON.stringify(object, null, 2) + os.EOL);
}

/**
 * @param {Object} packageJson - Contents of package.json
 * @return {string} - path to new package.json file
 */
function writePackageJson(packageJson) {
  const packageJsonPath = path.resolve('package.json');
  writeJson(packageJsonPath, packageJson);
  return packageJsonPath;
}

module.exports = {
  writePackageJson,
  writeJson,
};
