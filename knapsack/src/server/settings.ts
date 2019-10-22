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
import GraphQLJSON from 'graphql-type-json';
import { FileDb } from './dbs/file-db';
import {
  KnapsackSettings,
  KnapsackSettingsStoreConfig,
} from '../schemas/knapsack.settings';
import { GenericResponse } from '../schemas/misc';

export { settingsTypeDef } from '../schemas/knapsack.settings';

export class Settings {
  db: FileDb;

  constructor({ dataDir }: KnapsackSettingsStoreConfig) {
    const defaults: KnapsackSettings = {
      title: 'My Title',
      parentBrand: {},
      customSections: [],
    };

    this.db = new FileDb({
      dbDir: dataDir,
      name: 'knapsack.settings',
      defaults,
    });
  }

  getSetting(id: string): any {
    return this.db.get(id);
  }

  getSettings(): KnapsackSettings {
    return this.db.getAll();
  }

  setSettings(data: any): void {
    this.db.setAll(data);
  }

  setSetting(id: string, data: KnapsackSettings): GenericResponse {
    // @todo validate
    try {
      this.db.set(id, data);
      return {
        ok: true,
        message: `Settings ${id} saved successfully!`,
      };
    } catch (e) {
      return {
        ok: false,
        message: `Settings ${id} NOT saved successfully. ${e.toString()}`,
      };
    }
  }
}

export const settingsResolvers = {
  Query: {
    settings: (parent, args, { settings }) => settings.getSettings(),
    settingsAll: (parent, args, { settings }) => settings.getSettings(),
  },
  Mutation: {
    setSettings: (
      parent,
      { settings: newSettings },
      { settings, canWrite },
    ) => {
      if (!canWrite) return false;
      settings.setSettings(newSettings);
      return settings.getSettings();
    },
    setSettingsAll: (
      parent,
      { settings: newSettings },
      { settings, canWrite },
    ) => {
      if (!canWrite) return false;
      settings.setSettings(newSettings);
      return settings.getSettings();
    },
  },
  JSON: GraphQLJSON,
};
