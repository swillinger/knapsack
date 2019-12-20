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
import fflip from 'fflip';
import { KsUserInfo } from '@knapsack/core/src/cloud';

export enum FeatureList {
  'templatePush' = 'templatePush',
}

export type Features = keyof typeof FeatureList;
export type KsFeatures = Record<Features, boolean>;

const isProd = process.env.NODE_ENV === 'production';

const criteria = [
  {
    id: 'isLocalDev',
    check: (user: KsUserInfo, arg: boolean): boolean => {
      return arg !== isProd;
    },
  },
];

const featuresConfig = [
  {
    id: FeatureList.templatePush,
    criteria: {
      isLocalDev: true,
    },
  },
];

fflip.config({
  criteria,
  features: featuresConfig,
});

export function getFeaturesForUser(userInfo: KsUserInfo): KsFeatures {
  return fflip.getFeaturesForUser(userInfo);
}

export const enableBlockquotes = false;
export const enableUiSettings = true;
// @todo fix ability to create new patterns via UI
export const enableUiCreatePattern = false;
export const enableTemplatePush = true;
// @todo enablePatternIcons is not support in pattern-grid.jsx and playground-sidebar--pattern-list-item as of adoption of gql over REST API
export const enablePatternIcons = false;
export const enableCodeBlockLiveEdit = false;
