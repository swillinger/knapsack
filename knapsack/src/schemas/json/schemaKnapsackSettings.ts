export default {
  description: 'Knapsack Settings',
  type: 'object',
  properties: {
    title: {
      description: 'The title of the site',
      type: 'string',
    },
    subtitle: {
      description: 'Site subtitle',
      type: 'string',
    },
    slogan: {
      type: 'string',
    },
    parentBrand: {
      description:
        'Settings related to the parent brand that owns/uses the design system',
      type: 'object',
      properties: {
        title: {
          description: 'Title/name of the parent brand',
          type: 'string',
        },
        homepage: {
          description: 'URI of homepage of parent brand',
          type: 'string',
        },
        logo: {
          description: 'URI of image file for brand logo',
          type: 'string',
        },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
  required: ['title'],
  $schema: 'http://json-schema.org/draft-07/schema#',
};
