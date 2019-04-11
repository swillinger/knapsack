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

const { PERMISSIONS } = require('../lib/constants');

const isProd = process.env.NODE_ENV === 'production';

const ROLES = {
  EDITOR: {
    id: 'editor',
    permissions: [PERMISSIONS.READ, PERMISSIONS.WRITE],
  },
  ANONYMOUS: {
    id: 'anonymous',
    permissions: [PERMISSIONS.READ],
  },
};

/* eslint-disable no-unused-vars */

/**
 * @param {Object} req - Is type `IncomingMessage` @todo set correctly
 * @returns {{ id: string, permissions: string[] }} - Role
 */
function getRole(req) {
  let role = ROLES.ANONYMOUS;
  if (!isProd) {
    role = ROLES.EDITOR;
  }
  return role;
}

/* eslint-enable no-unused-vars */

module.exports = {
  getRole,
};
