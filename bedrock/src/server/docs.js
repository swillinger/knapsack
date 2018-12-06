const { gql } = require('apollo-server-express');
const globby = require('globby');
const { join, parse } = require('path');
const fs = require('fs-extra');
const md = require('marked');
const matter = require('gray-matter');

const docsTypeDef = gql`
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
 * @typedef {Object} Doc
 * @prop {string} content - markdown string
 * @prop {string} src - path to original Markdown source
 * @prop {Object} data - yaml front matter
 * @prop {string} data.title
 * @prop {number} data.order
 * @prop {string} html - HTML of Markdown contents
 * @prop {string} id - filename with no extension or directory
 */

class Docs {
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

    // @ts-ignore
    return docs.sort((a, b) => {
      // @ts-ignore
      if (a.data.order < b.data.order) return -1;
      // @ts-ignore
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

const docsResolvers = {
  Query: {
    docs: (parent, args, { docs }) => docs.getDocs(),
    doc: (parent, { id }, { docs }) => docs.getDoc(id),
  },
  Mutation: {
    setDoc: async (parent, { id, content, data }, { docs }) =>
      docs.setDoc(id, content, data),
  },
};

module.exports = {
  Docs,
  docsTypeDef,
  docsResolvers,
};
