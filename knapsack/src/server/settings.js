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
const { gql } = require('apollo-server-express');
const GraphQLJSON = require('graphql-type-json');
const { FileDb } = require('./dbs/file-db');

const settingsTypeDef = gql`
  scalar JSON

  type CustomSectionMenuItem {
    id: ID
    title: String
  }

  type CustomSection {
    id: ID
    title: String
    showInMainMenu: Boolean
    pages: [CustomSectionMenuItem]
  }

  type SettingsParentBrand {
    "URL to image"
    logo: String
    title: String
    homepage: String
  }

  type Settings {
    title: String!
    subtitle: String
    slogan: String
    parentBrand: SettingsParentBrand
    customSections: [CustomSection]
  }

  type Query {
    settings: Settings
    settingsAll: JSON
  }

  type Mutation {
    setSettings(settings: JSON): Settings
    setSettingsAll(settings: JSON): JSON
  }
`;

class Settings {
  /**
   * @param {KnapsackSettingsStoreConfig} Object
   */
  constructor({ dataDir }) {
    /** @type {KnapsackSettings} */
    const defaults = {
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

  /**
   * @param {string} id
   * @return {any}
   */
  getSetting(id) {
    return this.db.get(id);
  }

  /**
   * @return {KnapsackSettings}
   */
  getSettings() {
    return this.db.getAll();
  }

  setSettings(data) {
    this.db.setAll(data);
  }

  /**
   * @param {string} id
   * @param {KnapsackSettings} data
   * @return {{ok: boolean, message: string}}
   */
  setSetting(id, data) {
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

const settingsResolvers = {
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

module.exports = {
  Settings,
  settingsTypeDef,
  settingsResolvers,
};
