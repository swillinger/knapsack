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
const { gql } = require('apollo-server-express');
const GraphQLJSON = require('graphql-type-json');
const { FileDb } = require('./dbs/file-db');

const pageBuilderPagesTypeDef = gql`
  scalar JSON

  type PageBuilderPageSlice {
    id: ID!
    patternId: ID!
    templateId: ID!
    data: JSON!
  }

  type PageBuilderPage {
    id: ID!
    title: String!
    description: String
    path: String!
    slices: [PageBuilderPageSlice]!
  }

  type Query {
    pageBuilderPage(id: ID): PageBuilderPage
    pageBuilderPages: [PageBuilderPage]
  }

  type Mutation {
    setPageBuilderPage(id: ID, data: JSON): PageBuilderPage
  }
`;

class PageBuilder {
  /**
   * @prop {string} dataDir - Directory to read/write examples files to
   */
  constructor({ dataDir }) {
    this.db = new FileDb({
      dbDir: dataDir,
      name: 'knapsack.page-builder',
      defaults: {},
    });
  }

  /**
   * @param {string} id
   * @return {Promise<PageBuilderPage>}
   */
  async getPageBuilderPage(id) {
    return this.db.get(id);
  }

  /**
   * @return {Promise<PageBuilderPage[]>}
   */
  async getPageBuilderPages() {
    return this.db.values();
  }

  /**
   * @param {string} id
   * @param {PageBuilderPage} data
   * @return {Promise<{ok: boolean, message: string}>}
   */
  async setPageBuilderPage(id, data) {
    try {
      this.db.set(id, data);
      return {
        ok: true,
        message: `PageBuilderPage ${id} saved successfully!`,
      };
    } catch (e) {
      return {
        ok: false,
        message: `PageBuilderPage ${id} NOT saved successfully. ${e.toString()}`,
      };
    }
  }
}

const pageBuilderPagesResolvers = {
  Query: {
    pageBuilderPage: (parent, { id }, { pageBuilderPages }) =>
      pageBuilderPages.getPageBuilderPage(id),
    pageBuilderPages: (parent, args, { pageBuilderPages }) =>
      pageBuilderPages.getPageBuilderPages(),
  },
  Mutation: {
    setPageBuilderPage: async (
      parent,
      { id, data },
      { pageBuilderPages, canWrite },
    ) => {
      if (!canWrite) return false;
      await pageBuilderPages.setPageBuilderPage(id, data);
      return pageBuilderPages.getPageBuilderPage(id);
    },
  },
  JSON: GraphQLJSON,
};

module.exports = {
  PageBuilder,
  pageBuilderPagesTypeDef,
  pageBuilderPagesResolvers,
};
