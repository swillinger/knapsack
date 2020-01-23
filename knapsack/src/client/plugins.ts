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
import global from 'global';
import { KsClientPlugin } from '../schemas/plugins';

/**
 * Plugins are internal alpha only for now, continued work on them with probably frequent API changes will happen until we feel confident in external use in the future.
 */
class PluginStore {
  plugins: Record<string, KsClientPlugin>;

  homePage: any;

  constructor() {
    this.plugins = {};
    this.homePage = null;
  }

  /**
   * Register Knapsack plugin
   */
  register(plugin: KsClientPlugin): void {
    if (plugin.id in this.plugins) {
      throw new Error(
        `Plugin with id "${plugin.id}" has already been registered.`,
      );
    }
    this.plugins[plugin.id] = plugin;
  }

  getPlugins(): KsClientPlugin[] {
    return Object.values(this.plugins);
  }

  /**
   * @param {object} options - Options to pass in
   * @param {Function} options.render - Render function that pass props to custom component
   * @return {void} - Sets the Home page
   * @deprecated
   */
  setHomePage({ render }) {
    this.homePage = { render };
  }

  // loadPlugins(api) {
  //   Object.keys(this.plugins)
  //     .map(name => this.plugins[name])
  //     .forEach(plugin => plugin(api));
  // }
}

// Enforce plugins store to be a singleton
const KEY = '__knapsack_PLUGINS';
function getPluginStore() {
  if (!global[KEY]) {
    global[KEY] = new PluginStore();
  }
  return global[KEY];
}

export const plugins: PluginStore = getPluginStore();
