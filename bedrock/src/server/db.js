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
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { join } = require('path');
const chokidar = require('chokidar');
const os = require('os');
const { bedrockEvents, EVENTS } = require('./events');

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
    const dbPath = join(dbDir, `${name}.json`);
    const adapter = new FileSync(dbPath, {
      serialize: data => JSON.stringify(data, null, 2) + os.EOL,
    });
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

    // Start watching the file in case user manually changes it so we can re-read it into memory
    const watcher = chokidar.watch(dbPath, {
      ignoreInitial: true,
    });

    watcher.on('all', () => {
      this.db = db.read();
    });

    bedrockEvents.on(EVENTS.SHUTDOWN, () => {
      watcher.close();
    });
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

  setAll(data) {
    return this.db.setState(data).write();
  }

  update(key, func) {
    return this.db.update(key, func).write();
  }
}

module.exports = {
  FileDb,
};
