const { gql } = require('apollo-server-express');
const GraphQLJSON = require('graphql-type-json');
const { FileDb } = require('./db');

const examplesTypeDef = gql`
  scalar JSON

  type ExampleSlice {
    id: ID!
    patternId: ID!
    data: JSON!
  }

  type Example {
    id: ID!
    title: String!
    path: String!
    slices: [ExampleSlice]!
  }

  type Query {
    example(id: ID): Example
    examples: [Example]
    setExample(id: ID, data: JSON): Example
  }
`;

class Examples {
  /**
   * @prop {string} dataDir - Directory to read/write examples files to
   */
  constructor({ dataDir }) {
    this.db = new FileDb({
      dbDir: dataDir,
      name: 'bedrock.examples',
      defaults: {},
    });
  }

  /**
   * @param {string} id
   * @return {Promise<ExamplePageData>}
   */
  async getExample(id) {
    return this.db.get(id);
  }

  /**
   * @return {Promise<ExamplePageData[]>}
   */
  async getExamples() {
    return this.db.values();
  }

  /**
   * @param {string} id
   * @param {ExamplePageData} data
   * @return {Promise<{ok: boolean, message: string}>}
   */
  async setExample(id, data) {
    try {
      this.db.set(id, data);
      return {
        ok: true,
        message: `Example ${id} saved successfully!`,
      };
    } catch (e) {
      return {
        ok: false,
        message: `Example ${id} NOT saved successfully. ${e.toString()}`,
      };
    }
  }
}

const examplesResolvers = {
  Query: {
    example: (parent, { id }, { examples }) => examples.getExample(id),
    setExample: async (parent, { id, data }, { examples }) => {
      await examples.setExample(id, data);
      return examples.getExample(id);
    },
    examples: (parent, args, { examples }) => examples.getExamples(),
  },
  JSON: GraphQLJSON,
};

module.exports = {
  Examples,
  examplesTypeDef,
  examplesResolvers,
};
