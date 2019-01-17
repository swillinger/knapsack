/**
 *  Copyright (C) 2018 Basalt
    This file is part of Bedrock.
    Bedrock is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Bedrock is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Bedrock; if not, see <https://www.gnu.org/licenses>.
 */
const globby = require('globby');
const { join } = require('path');
const fs = require('fs-extra');
const os = require('os');
const log = require('../cli/log');

/**
 * @param {string} fileName - path to where JSON file should be written
 * @param {Object} object - data to turn to JSON
 * @return {Promise<void>}
 */
function writeJson(fileName, object) {
  return fs.writeFile(fileName, JSON.stringify(object, null, 2) + os.EOL);
}

/**
 * @param {string} fileName - path to where JSON file should be read
 * @return {Promise<Object>}
 */
function readJson(fileName) {
  return fs.readFile(fileName, 'utf8').then(file => JSON.parse(file));
}

/**
 * @param {string} fileName - path to where JSON file should be read
 * @return {Object}
 */
function readJsonSync(fileName) {
  return JSON.parse(fs.readFileSync(fileName, 'utf8'));
}

/**
 * Get a NPM package's package.json as object
 * @param {string} pkg
 * @return {Object} - The package.json
 */
function getPkg(pkg) {
  const pkgPath = require.resolve(`${pkg}/package.json`);
  return readJsonSync(pkgPath);
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

/**
 * @param {string} filePath
 * @return {boolean}
 */
function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

/**
 * @param {string} dirPath
 * @return {boolean}
 */
function dirExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (err) {
    return false;
  }
}

/**
 * @param {string} filePath
 * @param {string} [msg]
 * @return {void}
 */
function fileExistsOrExit(filePath, msg) {
  if (fileExists(filePath)) return;
  log.error(msg || `This file does not exist! ${filePath}`);
  process.exit(1);
}

/**
 * @param {string} dirPath
 * @param {string} [msg]
 * @return {void}
 */
function dirExistsOrExit(dirPath, msg) {
  if (dirExists(dirPath)) return;
  log.error(msg || `This folder does not exist! ${dirPath}`);
  process.exit(1);
}

module.exports = {
  writeJson,
  readJson,
  readJsonSync,
  getPkg,
  findReadmeInDir,
  findReadmeInDirSync,
  fileExists,
  dirExists,
  fileExistsOrExit,
  dirExistsOrExit,
};
