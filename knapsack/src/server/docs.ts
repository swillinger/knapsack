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
import { gql } from 'apollo-server-express';
import globby from 'globby';
import { join, parse } from 'path';
import fs from 'fs-extra';
import md from 'marked';
import matter from 'gray-matter';

export const docsTypeDef = gql`
  type DocData {
    title: String!
  }

  type Doc {
    "Markdown"
    content: String!
    html: String!
    id: ID!
    data: DocData!
  }

  type Query {
    docs: [Doc]
    doc(id: ID): Doc
  }

  type Mutation {
    setDoc(id: ID!, content: String!): Doc
  }
`;

/**
 * @typedef {object} Doc
 * @prop {string} content - markdown string
 * @prop {string} src - path to original Markdown source
 * @prop {object} data - yaml front matter
 * @prop {string} data.title
 * @prop {number} data.order
 * @prop {string} html - HTML of Markdown contents
 * @prop {string} id - filename with no extension or directory
 */

export class Docs {
  /**
   * @param {Object} opt
   * @param {string} opt.docsDir
   */
  constructor({ docsDir }) {
    /** @type {string} */
    this.docsDir = docsDir;
  }

  /**
   * @param {string} id
   * @return {Promise<Doc>}
   */
  async getDoc(id) {
    const docs = await this.getDocs();
    return docs.find(doc => doc.id === id);
  }

  /**
   * @return {Promise<Doc[]>}
   */
  async getDocs() {
    if (!this.docsDir) return [];
    /** @type {string[]} */
    const docPaths = await globby([join(this.docsDir, '*.md')]);
    const docs = await Promise.all(
      docPaths.map(async doc => {
        const results = matter(await fs.readFile(doc, 'utf8'));
        return {
          ...results,
          html: md.parse(results.content),
          id: parse(doc).name,
          src: doc,
        };
      }),
    );

    return docs.sort((a, b) => {
      if (a.data.order < b.data.order) return -1;
      if (a.data.order > b.data.order) return 1;
      return 0;
    });
  }

  /**
   * @param {string} id
   * @param {string} content - Markdown content
   * @return {Promise<Doc>}
   */
  async setDoc(id, content) {
    const doc = await this.getDoc(id);
    const fileString = matter.stringify(content, doc.data);
    await fs.writeFile(doc.src, fileString);
    return this.getDoc(id);
  }
}

export const docsResolvers = {
  Query: {
    docs: (parent, args, { docs }) => docs.getDocs(),
    doc: (parent, { id }, { docs }) => docs.getDoc(id),
  },
  Mutation: {
    setDoc: async (parent, { id, content, data }, { docs, canWrite }) => {
      if (!canWrite) return false;
      return docs.setDoc(id, content, data);
    },
  },
};
