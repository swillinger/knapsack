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
import fs from 'fs-extra';
import os from 'os';
import qs from 'qs';
import yaml from 'js-yaml';
import { exec } from 'child_process';
import prettier from 'prettier';
import * as log from '../cli/log';

/**
 * @param fileName - path to where JSON file should be written
 * @param object - data to turn to JSON
 */
export function writeJson(fileName: string, object: object): Promise<void> {
  return fs.writeFile(fileName, JSON.stringify(object, null, 2) + os.EOL);
}

/**
 * @param fileName - path to where JSON file should be read
 */
export function readJson(fileName: string): Promise<{ [k: string]: any }> {
  return fs.readFile(fileName, 'utf8').then(file => JSON.parse(file));
}

export function readJsonSync(fileName: string): object {
  return JSON.parse(fs.readFileSync(fileName, 'utf8'));
}

export function writeYaml(fileName: string, object: object): Promise<void> {
  return fs.writeFile(fileName, yaml.safeDump(object, { noRefs: true }));
}

export function readYaml(fileName: string): Promise<{ [k: string]: any }> {
  return fs
    .readFile(fileName, 'utf8')
    .then(file => yaml.safeLoad(file, { filename: fileName }));
}

export function readYamlSync(fileName: string): object {
  return yaml.safeLoad(fs.readFileSync(fileName, 'utf8'), {
    filename: fileName,
  });
}

export function isRemoteUrl(url: string): boolean {
  return url.startsWith('http') || url.startsWith('//');
}

/**
 * Get a NPM package's package.json as object
 */
export function getPkg(pkg: string): object {
  const pkgPath = require.resolve(`${pkg}/package.json`);
  return readJsonSync(pkgPath);
}

export function fileExists(filePath: string): boolean {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

export function dirExists(dirPath: string): boolean {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (err) {
    return false;
  }
}

export function fileExistsOrExit(filePath: string, msg?: string): void {
  if (fileExists(filePath)) return;
  log.error(msg || `This file does not exist! ${filePath}`);
  process.exit(1);
}

export function dirExistsOrExit(dirPath: string, msg?: string): void {
  if (dirExists(dirPath)) return;
  log.error(msg || `This folder does not exist! ${dirPath}`);
  process.exit(1);
}

export function getGitBranch(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(
      'git symbolic-ref --short HEAD',
      { encoding: 'utf8' },
      (err, stdout, stderr) => {
        if (err) {
          console.error(`Uh oh! error thrown in getGitBranch: ${err.message}`);
          resolve('UNKNOWN');
        }
        if (stderr) {
          console.error(`Uh oh! stderr output in getGitBranch: ${stderr}`);
          resolve('UNKNOWN');
        }
        resolve(stdout?.trim());
      },
    );
  });
}

/**
 * Parse QueryString, decode non-strings
 * Changes strings like `'true'` to `true` among others like numbers
 * @see qsStringify
 */
export function qsParse(querystring: string): object {
  return qs.parse(querystring, {
    // This custom decoder is for turning values like `foo: "true"` into `foo: true`, along with Integers, null, and undefined.
    // https://github.com/ljharb/qs/issues/91#issuecomment-437926409
    decoder(str) {
      const strWithoutPlus = str.replace(/\+/g, ' ');

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
 * @see qsParse
 */
export function qsStringify(data: object): string {
  return qs.stringify(data);
}

/**
 * Create a demo url
 */
export function createDemoUrl({
  patternId,
  templateId,
  assetSetId,
  isInIframe = false,
  wrapHtml = true,
  data,
  demoDataIndex,
}: {
  patternId: string;
  templateId: string;
  assetSetId?: string;
  isInIframe?: boolean;
  wrapHtml?: boolean;
  data?: object;
  demoDataIndex?: number;
}): string {
  const queryData: { [k: string]: any } = {
    patternId,
    templateId,
    assetSetId,
    isInIframe,
    wrapHtml,
  };

  if (data) {
    queryData.data = qsStringify(data);
  } else if (typeof demoDataIndex === 'number') {
    queryData.demoDataIndex = demoDataIndex;
  }

  const queryString = qsStringify(queryData);
  return `/api/render?${queryString}`;
}

export function base64ToString(b64: string): string {
  return Buffer.from(b64, 'base64').toString();
}

export function stringToBase64(string: string): string {
  return Buffer.from(string).toString('base64');
}

/**
 * Format code with Prettier
 * If it can't format, it just returns original code
 * @link https://prettier.io/docs/en/options.html#parser
 */
export function formatCode({
  code,
  language,
}: {
  code: string;
  language: string;
}): string {
  const format = parser =>
    prettier.format(code.trim(), {
      trailingComma: 'all',
      singleQuote: true,
      semi: true,
      parser,
      htmlWhitespaceSensitivity: 'ignore',
    });

  switch (language) {
    case 'html':
      return format('html');
    case 'react':
    case 'js':
    case 'jsx':
      return format('babel');
    case 'ts':
    case 'tsx':
    case 'react-typescript':
      return format('typescript');
    case 'json':
      return format('json');
    case 'md':
    case 'markdown':
      return format('markdown');
    default:
      return code.trim();
  }
}
