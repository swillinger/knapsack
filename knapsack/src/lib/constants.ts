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
import { PERMISSIONS } from '@knapsack/core/dist/cloud';

const { API_URL_BASE } = process.env;

export { PERMISSIONS };

/**
 * Base Paths for URLs
 * DO NOT INCLUDE TRAILING SLASH!
 */
export enum BASE_PATHS {
  PATTERN = '/pattern',
  PATTERNS = '/patterns',
  PAGES = '/pages',
  PAGE_BUILDER = '/page-builder',
  CUSTOM_PAGES = '/custom-pages',
  GRAPHIQL_PLAYGROUND = '/graphql-playground',
  DOCS = '/docs-dir',
}

export const FILE_NAMES = {
  PATTERN_CONFIG: 'knapsack.pattern.js',
  PATTERN_META: 'knapsack.pattern-meta.json',
  CONFIG: 'knapsack.config.js',
};

export const apiUrlBase = API_URL_BASE || '/api';
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

/**
 * HTTP Status Codes
 * @link https://kapeli.com/cheat_sheets/HTTP_Status_Codes.docset/Contents/Resources/Documents/index
 */
export const HTTP_STATUS = {
  /**
   * 2xx success
   */
  GOOD: {
    OK: 200,
    /**
     * The request has been fulfilled and a new resource has been created.
     */
    CREATED: 201,
    /**
     * The request has been accepted but has not been processed yet. This code does not guarantee that the request will process successfully.
     */
    ACCEPTED: 202,
    /**
     * The server accepted the request but is not returning any content. This is often used as a response to a DELETE request
     */
    NO_CONTENT: 204,
    /**
     * Similar to a 204 No Content response but this response requires the requester to reset the document view.
     */
    RESET_CONTENT: 205,
  },

  /**
   * 4xx client error, it's you
   */
  BAD: {
    /**
     * The request could not be fulfilled due to the incorrect syntax of the request.
     */
    BAD_REQUEST: 400,
    /**
     * The requester is not authorized to access the resource. This is similar to 403 but is used in cases where authentication is expected but has failed or has not been provided.
     */
    UNAUTHORIZED: 401,
    /**
     * The resource is no longer available at the requested URI and no redirection will be given.
     */
    GONE: 410,
  },

  /**
   * 5xx server error, it's us
   */
  FAIL: {
    /**
     * Generic
     */
    INTERNAL_ERROR: 500,
    INSUFFICIENT_STORAGE: 507,
  },
};
