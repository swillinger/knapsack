const { gql } = require('apollo-server-express');
const GraphQLJSON = require('graphql-type-json');
const { FileDb } = require('./db');

const settingsTypeDef = gql`
  scalar JSON

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
   * @param {BedrockSettingsStoreConfig} Object
   */
  constructor({ dataDir }) {
    /** @type {BedrockSettings} */
    const defaults = {
      title: 'My Title',
      parentBrand: {},
    };

    this.db = new FileDb({
      dbDir: dataDir,
      name: 'bedrock.settings',
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
   * @return {BedrockSettings}
   */
  getSettings() {
    return this.db.getAll();
  }

  setSettings(data) {
    this.db.setAll(data);
  }

  /**
   * @param {string} id
   * @param {BedrockSettings} data
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
    setSettings: (parent, { settings: newSettings }, { settings }) => {
      settings.setSettings(newSettings);
      return settings.getSettings();
    },
    setSettingsAll: (parent, { settings: newSettings }, { settings }) => {
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
