/*
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
import gql from 'graphql-tag';

export interface KnapsackSettingsStoreConfig {
  dataDir: string;
}
export interface KnapsackSettings {
  title: string;
  subtitle?: string;
  slogan?: string;
  parentBrand?: {
    homepage?: string;
    /** image url */
    logo?: string;
    title?: string;
  };
  customSections: {
    id: string;
    title: string;
    showInMainMenu: boolean;
    pages: {
      id: string;
      title: string;
    }[];
  }[];
}

export const settingsTypeDef = gql`
  scalar JSON

  type CustomSectionMenuItem {
    id: ID
    title: String
  }

  type CustomSection {
    id: ID
    title: String
    showInMainMenu: Boolean
    pages: [CustomSectionMenuItem]
  }

  type SettingsParentBrand {
    "URL to image"
    logo: String
    title: String
    homepage: String
  }

  type Settings {
    title: String!
    subtitle: String
    slogan: String
    parentBrand: SettingsParentBrand
    customSections: [CustomSection]
  }

  type Query {
    settings: Settings
    settingsAll: JSON
  }

  type Mutation {
    setSettings(settings: JSON): Settings
    setSettingsAll(settings: JSON): JSON
  }
`;

export const knapsackSettingsSchema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'Knapsack Settings',
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
