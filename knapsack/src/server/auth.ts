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

import { PERMISSIONS } from '../lib/constants';

const isProd = process.env.NODE_ENV === 'production';

export interface Role {
  id: string;
  permissions: string[];
}

export const ROLES: Record<'EDITOR' | 'ANONYMOUS', Role> = {
  EDITOR: {
    id: 'editor',
    permissions: [PERMISSIONS.READ, PERMISSIONS.WRITE],
  },
  ANONYMOUS: {
    id: 'anonymous',
    permissions: [
      PERMISSIONS.READ,
      PERMISSIONS.WRITE, // @todo remove after user testing done; doing this to test out user accounts
    ],
  },
};

/* eslint-disable no-unused-vars */

/**
 * (Stubbed/Fake) Get Role from the user found in the `request` object
 * Not real - currently based on if the server is ran with `NODE_ENV=production`
 */
export function getRole(req: import('express').Request): Role {
  let role = ROLES.ANONYMOUS;
  if (!isProd) {
    role = ROLES.EDITOR;
  }
  return role;
}

/* eslint-enable no-unused-vars */
