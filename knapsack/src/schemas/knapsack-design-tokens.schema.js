const knapsackDesignTokenSchema = {
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

const knapsackDesignTokensSchema = {
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

module.exports = {
  knapsackDesignTokenSchema,
  knapsackDesignTokensSchema,
};
