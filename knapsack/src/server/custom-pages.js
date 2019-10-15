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

const customPagesTypeDef = gql`
  scalar JSON

  type Slice {
    id: ID!
    blockId: String!
    data: JSON
  }

  type CustomPage {
    path: ID!
    slices: [Slice]
  }

  type Query {
    customPages: [CustomPage]
    customPage(path: ID): CustomPage
  }

  type Mutation {
    setCustomPage(path: ID, customPage: JSON): CustomPage
  }
`;

class CustomPages {
  /**
   * @param {{ dataDir: string }} Object
   */
  constructor({ dataDir }) {
    const defaults = {
      pages: [],
    };

    this.db = new FileDb({
      dbDir: dataDir,
      name: 'knapsack.custom-pages',
      defaults,
    }).getDb();
  }

  /**
   * @param {string} path
   * @return {KnapsackCustomPage}
   */
  getCustomPage(path) {
    const page = this.getCustomPages().find(p => p.path === path);
    if (page) return page;
    return this.createCustomPage(path).find(p => p.path === path);
  }

  /**
   * @param {string} path
   * @return {KnapsackCustomPage[]}
   */
  createCustomPage(path) {
    return this.db
      .get('pages')
      .push({ path, slices: [] })
      .write();
  }

  /**
   * @return {KnapsackCustomPage[]}
   */
  getCustomPages() {
    return this.db.get('pages').value();
  }

  /**
   * @param {string} path
   * @param {object} data
   * @return {KnapsackCustomPage}
   */
  setCustomPage(path, data) {
    return this.db
      .get('pages')
      .find({ path })
      .assign({ ...data, path })
      .write();
  }
}

const customPagesResolvers = {
  Query: {
    customPage: (parent, { path }, { customPages }) =>
      customPages.getCustomPage(path),
    customPages: (parent, args, { customPages }) =>
      customPages.getCustomPages(),
  },
  Mutation: {
    setCustomPage: (
      parent,
      { path, customPage },
      { customPages, canWrite },
    ) => {
      if (!canWrite) return false;
      return customPages.setCustomPage(path, customPage);
    },
  },
  JSON: GraphQLJSON,
};

module.exports = {
  CustomPages,
  customPagesTypeDef,
  customPagesResolvers,
};
