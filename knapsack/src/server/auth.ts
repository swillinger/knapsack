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
import {
  KsUserInfo,
  KS_USER_ROLES,
  KS_USER_ROLE_IDS,
} from '@knapsack/core/dist/cloud';

export function getUserInfo(req: import('express').Request): KsUserInfo {
  const Authorization = req.headers.authorization;
  const roleId = req.headers['x-ks-cloud-role-id']?.toString();
  const ksRepoAccess =
    req.headers['x-ks-cloud-repo-access']?.toString()?.split(',') || [];
  const username = req.headers['x-ks-cloud-username']?.toString();

  let role = KS_USER_ROLES.anonymous;
  if (roleId && roleId in KS_USER_ROLE_IDS) {
    role = KS_USER_ROLES[roleId];
  }

  const userInfo = {
    username,
    role,
    ksRepoAccess,
    Authorization,
  };

  // console.log('getUserInfo', userInfo);
  return userInfo;
}
