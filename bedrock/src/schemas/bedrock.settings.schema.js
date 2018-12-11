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
const {
  tokenCategoriesWithDemo,
} = require('@basalt/bedrock-design-token-demos/constants');

module.exports = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'Bedrock Settings',
  additionalProperties: false,
  required: ['title'],
  properties: {
    title: {
      title: 'Title',
      type: 'string',
      description: 'The title of the site',
    },
    subtitle: {
      title: 'Subtitle',
      type: 'string',
      description: 'Site subtitle',
    },
    slogan: {
      title: 'Slogan',
      type: 'string',
      description: 'Slogan for this design system',
    },
    parentBrand: {
      title: 'Parent Brand',
      type: 'object',
      description:
        'Settings related to the parent brand that owns/uses the design system',
      additionalProperties: false,
      required: [],
      properties: {
        logo: {
          title: 'Logo',
          type: 'string',
          description: 'URI of image file for brand logo',
        },
        title: {
          title: 'Title',
          type: 'string',
          description: 'Title/name of the parent brand',
        },
        homepage: {
          title: 'Homepage',
          type: 'string',
          description: 'URI of homepage of parent brand',
        },
      },
    },
    designTokens: {
      type: 'object',
      title: 'Design Tokens',
      properties: {
        groups: {
          type: 'array',
          title: 'Token Groups',
          description:
            'Collections of Token Categories; all shown on a single page with own menu item.',
          items: {
            type: 'object',
            required: ['id', 'title', 'tokenCategoryIds'],
            properties: {
              id: {
                type: 'string',
                title: 'ID',
              },
              title: {
                type: 'string',
                title: 'Title',
              },
              description: {
                type: 'string',
                title: 'Description',
              },
              tokenCategoryIds: {
                type: 'array',
                title: 'Token Category IDs',
                description:
                  'Each of these represent the Theo Design Token category you assigned it; these are often assigned to a single CSS declaration like `background-color` or `border-color`.',
                items: {
                  type: 'string',
                  title: 'Token Category',
                  enum: tokenCategoriesWithDemo,
                },
              },
            },
          },
        },
      },
    },
  },
};
