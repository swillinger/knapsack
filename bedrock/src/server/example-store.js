const fs = require('fs-extra');
const path = require('path');
const { writeJson } = require('./server-utils');

/**
 * @typedef {Object} ExampleStoreConfig
 * @prop {string} dir - Directory to read/write examples files to
 */

class ExampleStore {
  /**
   * @param {ExampleStoreConfig} Object
   */
  constructor({ dir }) {
    /** @type {string} */
    this.dir = dir;
  }

  /**
   * @param {string} id
   * @return {string}
   */
  getPath(id) {
    return path.join(this.dir, `${id}.json`);
  }

  /**
   * @param {string} id
   * @return {Promise<ExamplePageData>}
   */
  async getExample(id) {
    const fileString = await fs.readFile(this.getPath(id), 'utf8');
    return JSON.parse(fileString);
  }

  /**
   * @return {Promise<ExamplePageData[]>}
   */
  async getExamples() {
    const files = await fs.readdir(this.dir);
    const filePaths = files
      .filter(filePath => filePath.endsWith('json'))
      .map(filePath => path.join(this.dir, filePath));

    return Promise.all(
      filePaths.map(async filePath => {
        const fileString = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileString);
      }),
    );
  }

  /**
   * @param {string} id
   * @param {ExamplePageData} data
   * @return {Promise<{ok: boolean, message: string}>}
   */
  async setExample(id, data) {
    try {
      await writeJson(this.getPath(id), data);
      return {
        ok: true,
        message: `Example ${id} saved successfully!`,
      };
    } catch (e) {
      return {
        ok: false,
        message: `Example ${id} NOT saved successfully. ${e.toString()}`,
      };
    }
  }
}

module.exports = ExampleStore;
