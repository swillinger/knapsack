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

const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
};

/**
 * Base Paths for URLs
 * DO NOT INCLUDE TRAILING SLASH!
 */
const BASE_PATHS = {
  PATTERNS: '/patterns',
  DESIGN_TOKENS: '/design-tokens',
  PAGES: '/pages',
  CUSTOM_PAGES: '/custom-pages',
  GRAPHIQL_PLAYGROUND: '/graphql-playground',
  DOCS: '/docs',
};

const FILE_NAMES = {
  PATTERN: 'bedrock.pattern.js',
  PATTERN_META: 'bedrock.pattern-meta.json',
  CONFIG: 'bedrock.config.js',
};

module.exports = {
  BASE_PATHS,
  FILE_NAMES,
  PERMISSIONS,
};
