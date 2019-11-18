export default {
  type: 'object',
  properties: {
    sections: {
      type: 'array',
      items: {
        $ref: '#/definitions/KnapsackCustomSection',
      },
    },
  },
  additionalProperties: false,
  definitions: {
    KnapsackCustomSection: {
      type: 'object',
      properties: {
        id: {
          description: 'Section ID',
          type: 'string',
        },
        title: {
          description: 'Section Title',
          type: 'string',
        },
        showInMainMenu: {
          description: 'Show in Main Menu\nWill always show in Secondary Menu',
          type: 'boolean',
        },
        pages: {
          type: 'array',
          items: {
            $ref: '#/definitions/KnapsackCustomSectionPage',
          },
        },
      },
      additionalProperties: false,
      required: ['id', 'pages', 'title'],
    },
    KnapsackCustomSectionPage: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        title: {
          type: 'string',
        },
      },
      additionalProperties: false,
      required: ['id', 'title'],
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
};
