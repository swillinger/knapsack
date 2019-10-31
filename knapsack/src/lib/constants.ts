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

export const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
};

/**
 * Base Paths for URLs
 * DO NOT INCLUDE TRAILING SLASH!
 */
export const BASE_PATHS = {
  PATTERN: '/pattern',
  PATTERNS: '/patterns',
  PAGES: '/pages',
  CUSTOM_PAGES: '/custom-pages',
  GRAPHIQL_PLAYGROUND: '/graphql-playground',
  DOCS: '/docs-dir',
};

export const FILE_NAMES = {
  PATTERN_CONFIG: 'knapsack.pattern.js',
  PATTERN_META: 'knapsack.pattern-meta.json',
  CONFIG: 'knapsack.config.js',
};

export const apiUrlBase = '/api';
export const graphqlBase = '/graphql';

export const EVENTS = {
  CONFIG_READY: 'CONFIG_READY',
  PATTERNS_DATA_READY: 'PATTERNS_DATA_READY',
  PATTERN_TEMPLATE_ADDED: 'PATTERN_TEMPLATE_ADDED',
  PATTERN_TEMPLATE_CHANGED: 'PATTERN_TEMPLATE_CHANGED',
  PATTERN_TEMPLATE_REMOVED: 'PATTERN_TEMPLATE_REMOVED',
  PATTERN_ASSET_CHANGED: 'PATTERN_ASSET_CHANGED',
  PATTERN_CONFIG_CHANGED: 'PATTERN_CONFIG_CHANGED',
  SHUTDOWN: 'SHUTDOWN',
};
