// const { validateSchema } = require('@basalt/bedrock-schema-utils');
const { FileDb } = require('./db');
// const settingsSchema = require('../schemas/bedrock.settings.schema');

class SettingsStore {
  /**
   * @param {BedrockSettingsStoreConfig} Object
   */
  constructor({ dataDir }) {
    /** @type {BedrockSettings} */
    const defaults = {
      title: 'A Super Simple Site',
      subtitle: 'A Simple Example of a Design System',
      slogan: "Wasn't that simple?",
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

module.exports = SettingsStore;
