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
    customSections: {
      type: 'array',
      title: 'Custom Sections',
      items: {
        type: 'object',
        required: ['id', 'title', 'pages'],
        properties: {
          id: {
            type: 'string',
            title: 'Section ID',
          },
          title: {
            type: 'string',
            title: 'Section Title',
          },
          showInMainMenu: {
            type: 'boolean',
            title: 'Show in Main Menu',
            description: 'Will always show in Secondary Menu',
            default: true,
          },
          pages: {
            type: 'array',
            title: 'Custom Pages',
            description:
              'Each item will become a page with a menu item and a unique URL',
            items: {
              type: 'object',
              required: ['id', 'title'],
              properties: {
                id: {
                  type: 'string',
                  title: 'Page ID',
                },
                title: {
                  type: 'string',
                  title: 'Page Title',
                },
              },
            },
          },
        },
      },
    },
  },
};
