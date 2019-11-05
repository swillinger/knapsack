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
import React from 'react';
import PropTypes from 'prop-types';

export const breakpoints = {
  xsmall: '380px',
  small: '450px',
  medium: '700px',
  large: '900px',
  xlarge: '1100px',
  xxlarge: '1300px',
  xxxlarge: '1600px',
};

export const typeColors = {
  icon: {
    base: '#536dfe',
    accent: '#e2e7ff',
  },
  component: {
    base: '#16394B',
    accent: '#CFE3DE',
  },
  typography: {
    base: '#16394B',
    accent: '#CFE3DE',
  },
  layout: {
    base: '#FFA000',
    accent: '#fff5e6',
  },
  color: {
    base: '#00695c',
    accent: '#d0f3ee',
  },
  none: {
    base: '#000',
    accent: '#e0e0e0',
  },
};

/**
 * Get Type Color
 * @returns A CSS var name
 */
export function getTypeColor(type: string, subtype = 'base'): string {
  return typeColors[type][subtype];
}

export interface KnapsackContextInterface {
  settings: import('../schemas/knapsack.settings').KnapsackSettings;
  meta: import('../schemas/misc').KnapsackMeta;
  // features: @todo
  permissions: string[]; // @todo improve types, perhaps with `keyof import('../lib/constants').PERMISSIONS`
}

export const baseContext = {};

export const KnapsackContext = React.createContext<
  Partial<KnapsackContextInterface>
>(baseContext);

export const {
  Provider: KnapsackContextProvider,
  Consumer: KnapsackContextConsumer,
} = KnapsackContext;

export function connectToContext(Component) {
  return props => (
    <KnapsackContextConsumer>
      {context => <Component {...props} context={context} />}
    </KnapsackContextConsumer>
  );
}

// @todo remove
export const contextPropTypes = PropTypes.shape({});
