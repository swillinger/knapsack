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
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { join } from 'path';
import chokidar from 'chokidar';
import os from 'os';
import { knapsackEvents, EVENTS } from '../events';

/**
 * Creates a LoDash powered JSON file database, via `lowdb` that is created using the `_.chain` method.
 * Each database has all of the power of LoDash for parsing the data.
 * @link https://www.npmjs.com/package/lowdb
 * @link https://lodash.com/docs/4.17.11#chain
 */
export class FileDb {
  db: low.LowdbSync<any>;

  constructor({
    dbDir,
    name,
    defaults = {},
  }: {
    dbDir: string;
    name: string;
    defaults?: object;
  }) {
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

    knapsackEvents.on(EVENTS.SHUTDOWN, () => {
      watcher.close();
    });
  }

  getDb() {
    return this.db;
  }

  get(key: string): any {
    // @todo improve types
    return this.db.get(key).value();
  }

  getAll(): any {
    // @todo improve types
    return this.db.value();
  }

  /**
   * @link https://lodash.com/docs/4.17.11#find
   */
  find(data: any): any {
    // @todo improve types
    return this.db.find(data).value();
  }

  values() {
    return this.db.values().value();
  }

  set(key: string, value: any): any {
    return this.db.set(key, value).write();
  }

  setAll(data: object): object {
    // @todo improve types
    return this.db.setState(data).write();
  }

  update(key: string, func: any): any {
    // @todo improve types
    return this.db.update(key, func).write();
  }
}
