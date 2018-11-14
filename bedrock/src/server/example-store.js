const { FileDb } = require('./db');

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
    this.db = new FileDb({
      dbDir: dir,
      name: 'bedrock.examples',
      defaults: {},
    });
  }

  /**
   * @param {string} id
   * @return {Promise<ExamplePageData>}
   */
  async getExample(id) {
    return this.db.get(id);
  }

  /**
   * @return {Promise<ExamplePageData[]>}
   */
  async getExamples() {
    return this.db.values();
  }

  /**
   * @param {string} id
   * @param {ExamplePageData} data
   * @return {Promise<{ok: boolean, message: string}>}
   */
  async setExample(id, data) {
    try {
      this.db.set(id, data);
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
