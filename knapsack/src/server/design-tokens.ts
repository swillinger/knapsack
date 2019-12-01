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
import GraphQLJSON from 'graphql-type-json';
import { KnapsackDesignToken } from '@knapsack/core/dist/types';
import { hasItemsInItems } from '../lib/utils';

export { designTokensTypeDef } from '@knapsack/core/dist/types';

export class DesignTokens {
  tokens: KnapsackDesignToken[];

  constructor({
    data: { tokens = [] },
  }: {
    data: {
      tokens?: KnapsackDesignToken[];
    };
  }) {
    this.tokens = tokens.map(token => {
      return {
        originalValue: token.value,
        ...token,
      };
    });
  }

  getTokens(category = '', tags?: string[]): KnapsackDesignToken[] {
    let { tokens } = this;
    if (category) {
      tokens = tokens.filter(t => t.category === category);
    }
    if (tags) {
      tokens = tokens.filter(t => hasItemsInItems(t.tags, tags));
    }
    return tokens;
  }
}

export const designTokensResolvers = {
  Query: {
    tokens: (parent, { category, tags }, { tokens }) =>
      tokens.getTokens(category, tags),
  },
  JSON: GraphQLJSON,
};

export const styleDictionaryKnapsackFormat = {
  name: 'knapsack',
  formatter: ({ allProperties }) => {
    const tokens = allProperties.map(
      ({ path, attributes, value, name, comment, tags = [] }) => {
        const [category, ...pathTags] = path;
        pathTags.pop(); // removes last item from array in-place
        return {
          value,
          name,
          comment,
          category,
          tags: [...tags, ...pathTags].filter(Boolean),
          meta: {
            path,
            attributes,
          },
        };
      },
    );
    return JSON.stringify({ tokens }, null, '  ');
  },
};

export function theoKnapsackFormat(theo) {
  theo.registerFormat('knapsack', result => {
    const theoTokens: {
      aliases: object;
      meta: object;
      props: {
        type: string;
        comment?: string;
        category: string;
        value: string;
        originalValue: string;
        name: string;
      }[];
    } = result.toJSON();
    const { props } = theoTokens;
    return {
      tokens: props.map(
        ({
          category,
          name,
          type = '',
          value,
          originalValue,
          comment = '',
        }) => ({
          value,
          name,
          comment,
          originalValue: originalValue || '',
          category,
          tags: [type].filter(Boolean),
        }),
      ),
    };
  });

  return {
    type: 'knapsack',
  };
}
