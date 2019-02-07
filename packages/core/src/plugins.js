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
import global from 'global';

class PluginStore {
  constructor() {
    this.plugins = {};
    this.homePage = null;
  }

  /**
   * Register Bedrock plugin
   * @param {string} name - machine name of plugin; no spaces, lowercase
   * @param {Function} plugin - Plugin function
   * @return {void} - Adds plugin to internal set
   */
  register(name, plugin) {
    // console.log('plugin registered', { name });
    this.plugins[name] = plugin;
  }

  /**
   * @param {Object} options - Options to pass in
   * @param {Function} options.render - Render function that pass props to custom component
   * @return {void} - Sets the Home page
   */
  setHomePage({ render }) {
    this.homePage = { render };
  }

  loadPlugins(api) {
    Object.keys(this.plugins)
      .map(name => this.plugins[name])
      .forEach(plugin => plugin(api));
  }
}

// Enforce plugins store to be a singleton
const KEY = '__BEDROCK_PLUGINS';
function getPluginStore() {
  if (!global[KEY]) {
    global[KEY] = new PluginStore();
  }
  return global[KEY];
}

/** @type {PluginStore} */
export const plugins = getPluginStore();
