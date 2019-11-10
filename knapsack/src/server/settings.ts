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
import { FileDb2 } from './dbs/file-db';
import {
  KnapsackSettings,
  KnapsackSettingsStoreConfig,
} from '../schemas/knapsack.settings';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import knapsackSettingsSchema from '../schemas/json/schemaKnapsackSettings';

export class Settings extends FileDb2<KnapsackSettings> {
  constructor({ dataDir }: KnapsackSettingsStoreConfig) {
    const defaults: KnapsackSettings = {
      title: 'My Title',
      parentBrand: {},
    };

    super({
      dbDir: dataDir,
      name: 'knapsack.settings',
      defaults,
      type: 'json',
      validationSchema: knapsackSettingsSchema,
    });
  }
}
