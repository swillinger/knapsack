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
/* eslint-disable max-classes-per-file */
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { join } from 'path';
import chokidar from 'chokidar';
import os from 'os';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import { validateDataAgainstSchema } from '@knapsack/schema-utils';
import { knapsackEvents, EVENTS } from '../events';
import { KnapsackDb, KnapsackFile } from '../../schemas/misc';

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

export class FileDb2<ConfigType> implements KnapsackDb<ConfigType> {
  /**
   * Full path to file used for storage
   */
  filePath: string;

  private type: 'json' | 'yml';

  // config: ConfigType;

  validationSchema: object;

  constructor({
    filePath,
    // dbDir,
    // name,
    type = 'json',
    defaults,
    validationSchema,
    watch = true,
    writeFileIfAbsent = true,
  }: {
    filePath: string;
    // dbDir: string;
    type?: 'json' | 'yml';
    // name: string;
    /**
     * Shallow merge
     */
    defaults?: ConfigType;
    /**
     * JSON Schema to validate read & writes with at run time
     */
    validationSchema?: object;
    watch?: boolean;
    writeFileIfAbsent?: boolean;
  }) {
    this.type = type;
    this.validationSchema = validationSchema;

    this.filePath = filePath;

    if (writeFileIfAbsent && !fs.existsSync(this.filePath)) {
      const x = this.serialize(defaults);
      console.log('x', x);
      fs.writeFileSync(this.filePath, x);
      // this.write(defaults, { sync: true }).then(() => {});
    }

    // if (writeFileIfAbsent) {
    //
    // }
    // this.config = this.read();

    if (watch) {
      // Start watching the file in case user manually changes it so we can re-read it into memory
      // const watcher = chokidar.watch(this.filePath, {
      //   ignoreInitial: true,
      // });
      //
      // watcher.on('all', () => {
      //   // @todo if file is changed, trigger client ui to get new changes - we can't have diverged data
      //   this.config = this.read();
      // });
      //
      // knapsackEvents.on(EVENTS.SHUTDOWN, () => {
      //   watcher.close();
      // });
    }
  }

  /**
   * Ensure the data is good during run-time by using provided JSON Schemas to validate
   * Requires `validationSchema` to be passed in during initial creation
   * @throws Error if it's not valid
   */
  validateConfig(config: ConfigType): void {
    if (!this.validationSchema) return;

    const { ok, message, errors } = validateDataAgainstSchema(
      this.validationSchema,
      config,
    );
    if (ok) return;
    const msg = [
      `Data validation error for ${this.filePath}`,
      'The data:',
      JSON.stringify(config, null, ' '),
      '',
      'The error:',
      message,
      JSON.stringify(errors, null, '  '),
    ].join('\n');
    throw new Error(msg);
  }

  serialize(config: ConfigType): Pick<KnapsackFile, 'contents' | 'encoding'> {
    this.validateConfig(config);
    switch (this.type) {
      case 'json': {
        const contents = JSON.stringify(config, null, 2) + os.EOL;
        return {
          contents,
          encoding: 'utf-8',
        };
      }
      case 'yml': {
        const contents = yaml.safeDump(config);
        return {
          contents,
          encoding: 'utf-8',
        };
      }
      default:
        throw new Error('Un-supported type used');
    }
  }

  parse(fileString: string): ConfigType {
    let config;
    switch (this.type) {
      case 'json':
        config = JSON.parse(fileString);
        this.validateConfig(config);
        return config;
      case 'yml':
        config = yaml.safeLoad(fileString);
        this.validateConfig(config);
        return config;
      default:
        throw new Error('Un-supported type used');
    }
  }

  async read(): Promise<ConfigType> {
    const dbString: string = await fs.readFile(this.filePath, 'utf8');
    return this.parse(dbString);
  }

  readSync(): ConfigType {
    const dbString: string = fs.readFileSync(this.filePath, 'utf8');
    return this.parse(dbString);
  }

  async savePrep(config: ConfigType): Promise<KnapsackFile[]> {
    this.validateConfig(config);
    const { contents, encoding } = this.serialize(config);
    return [
      {
        contents,
        encoding,
        path: this.filePath,
      },
    ];
  }

  // async write(config: ConfigType, { sync = false } = {}): Promise<string> {
  //   const { contents, path, encoding } = this.savePrep(config);
  //   if (sync) {
  //     fs.writeFileSync(path, contents, { encoding });
  //   } else {
  //     await fs.writeFile(path, contents, { encoding });
  //   }
  //   return path;
  // }

  async getData(): Promise<ConfigType> {
    const config = await this.read();
    this.validateConfig(config);
    return config;
  }

  getDataSync(): ConfigType {
    const config = this.readSync();
    this.validateConfig(config);
    return config;
  }
}
