/*
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

export interface KnapsackSettingsStoreConfig {
  dataDir: string;
}

/**
 * Knapsack Settings
 */
export interface KnapsackSettings {
  /**
   * The title of the site
   */
  title: string;
  /**
   * Site subtitle
   */
  subtitle?: string;
  slogan?: string;
  /**
   * Settings related to the parent brand that owns/uses the design system
   */
  parentBrand?: {
    /**
     * Title/name of the parent brand
     */
    title?: string;
    /**
     * URI of homepage of parent brand
     */
    homepage?: string;
    /**
     * URI of image file for brand logo
     */
    logo?: string;
  };
}
