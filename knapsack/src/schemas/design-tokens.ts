import gql from 'graphql-tag';

export interface KnapsackDesignToken {
  name: string;
  value: string;
  category: string;
  tags?: string[];
  originalValue: string;
  code?: string;
  comment?: string;
}

export const designTokensTypeDef = gql`
  scalar JSON

  "A single value that can be assigned to a single CSS declaration"
  type DesignToken {
    category: String
    name: String!
    originalValue: String
    value: String!
    comment: String
    code: String
    tags: [String]
    meta: JSON
  }

  type Query {
    tokens(category: String, tags: [String]): [DesignToken]
  }
`;

export const knapsackDesignTokenSchema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  title: 'Knapsack Design Tokens',
  type: 'object',
  required: ['name', 'value', 'category'],
  properties: {
    name: {
      type: 'string',
    },
    value: {
      type: ['string', 'number'],
    },
    code: {
      type: 'string',
    },
    category: {
      type: 'string',
    },
    comment: {
      type: 'string',
    },
    originalValue: {
      type: ['string', 'number'],
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    meta: {
      type: 'object',
    },
  },
};

export const knapsackDesignTokensSchema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  required: ['tokens'],
  properties: {
    tokens: {
      type: 'array',
      items: knapsackDesignTokenSchema,
    },
  },
};
