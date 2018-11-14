const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { join } = require('path');

/**
 * Creates a LoDash powered JSON file database, via `lowdb` that is created using the `_.chain` method.
 * Each database has all of the power of LoDash for parsing the data.
 * @link https://www.npmjs.com/package/lowdb
 * @link https://lodash.com/docs/4.17.11#chain
 */
class FileDb {
  /**
   * @param {Object} params
   * @param {string} params.dbDir
   * @param {string} params.name
   * @param {Object} [params.defaults={}]
   */
  constructor({ dbDir, name, defaults = {} }) {
    // @todo kebab-case `name`
    // @todo should this read a pre-existing file first?
    const adapter = new FileSync(join(dbDir, `${name}.json`));
    const db = low(adapter);

    // Set some defaults (required if your JSON file is empty)
    db.defaults(defaults).write();
    this.db = db;

    // You can use any lodash function like _.get and _.find with shorthand syntax.
    //
    // // Use .value() instead of .write() if you're only reading from db
    // db.get('posts')
    //   .find({ id: 1 })
    //   .value()
  }

  getDb() {
    return this.db;
  }

  get(key) {
    return this.db.get(key).value();
  }

  getAll() {
    return this.db.value();
  }

  // https://lodash.com/docs/4.17.11#find
  find(data) {
    return this.db.find(data).value();
  }

  values() {
    return this.db.values().value();
  }

  set(key, value) {
    return this.db.set(key, value).write();
  }

  update(key, func) {
    return this.db.update(key, func).write();
  }
}

module.exports = {
  FileDb,
};
