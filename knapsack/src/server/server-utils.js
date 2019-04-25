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
const fs = require('fs-extra');
const os = require('os');
const qs = require('qs');
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

/**
 * Parse QueryString, decode non-strings
 * Changes strings like `'true'` to `true` among others like numbers
 * @param {string} querystring
 * @return {Object}
 * @see qsStringify
 */
function qsParse(querystring) {
  return qs.parse(querystring, {
    // This custom decoder is for turning values like `foo: "true"` into `foo: true`, along with Integers, null, and undefined.
    // https://github.com/ljharb/qs/issues/91#issuecomment-437926409
    decoder(str, decoder, charset) {
      const strWithoutPlus = str.replace(/\+/g, ' ');
      if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
      }

      if (/^(\d+|\d*\.\d+)$/.test(str)) {
        return parseFloat(str);
      }

      const keywords = {
        true: true,
        false: false,
        null: null,
        undefined,
      };
      if (str in keywords) {
        return keywords[str];
      }

      // utf-8
      try {
        return decodeURIComponent(strWithoutPlus);
      } catch (e) {
        return strWithoutPlus;
      }
    },
  });
}

/**
 * Turn object of data into query string
 * @param {Object} data
 * @return {string}
 * @see qsParse
 */
function qsStringify(data) {
  return qs.stringify(data);
}

/**
 * Create a demo url
 * @param {Object} opt
 * @param {string} opt.patternId
 * @param {string} opt.templateId
 * @param {string} opt.assetSetId
 * @param {boolean} [opt.isInIframe=false]
 * @param {boolean} [opt.wrapHtml=true]
 * @param {Object} [opt.data]
 * @return {string}
 */
function createDemoUrl({
  patternId,
  templateId,
  assetSetId,
  isInIframe = false,
  wrapHtml = true,
  data = {},
}) {
  const queryString = qsStringify({
    patternId,
    templateId,
    assetSetId,
    isInIframe,
    wrapHtml,
    data,
  });
  return `/api/render?${queryString}`;
}

module.exports = {
  writeJson,
  readJson,
  readJsonSync,
  getPkg,
  fileExists,
  dirExists,
  fileExistsOrExit,
  dirExistsOrExit,
  qsParse,
  qsStringify,
  createDemoUrl,
};
