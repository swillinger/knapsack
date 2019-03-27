module.exports = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'List Group',
  description: 'Provide contextual feedback messages for typical user actions with the handful of available and flexible list-group messages.',
  required: ['listItems'],
  properties: {
    flush: {
      type: 'boolean',
      title: 'Flush',
      description: 'Removes borders',
      default: false,
    },
    listItems: {
      type: 'array',
      title: 'List Items',
      items: {
        type: 'object',
        title: 'List Item',
        required: ['itemText'],
        properties: {
          itemText: {
            type: 'string',
            title: 'List Item Text',
          },
          style: {
            type: 'string',
            title: 'Style',
            enum: [
              'primary',
              'secondary',
              'success',
              'danger',
              'warning',
              'info',
              'light',
              'dark',
              'link',
            ],
            enumNames: [
              'Primary',
              'Secondary',
              'Success',
              'Danger',
              'Warning',
              'Info',
              'Light',
              'Dark',
              'Link',
            ],
          },
          active: {
            type: 'boolean',
            title: 'Active',
            default: false,
          },
          disabled: {
            type: 'boolean',
            title: 'Disabled',
            default: false,
          },
        },
      },
    },
  },
  examples: [
    {
      listItems: [
        {
          itemText: 'Cras justo odio',
          active: true,
        },
        {
          itemText: 'Dapibus ac facilisis in',
        },
        {
          itemText: 'Morbi leo risus',
          disabled: true,
        },
        {
          itemText: 'Porta ac consectetur ac',
        },
        {
          itemText: 'Vestibulum at eros',
        },
      ],
    },
    {
      listItems: [
        {
          itemText: 'Cras justo odio',
          style: 'primary',
        },
        {
          itemText: 'Dapibus ac facilisis in',
          style: 'secondary',
        },
        {
          itemText: 'Morbi leo risus',
          disabled: true,
        },
        {
          itemText: 'Porta ac consectetur ac',
          style: 'success',
        },
        {
          itemText: 'Vestibulum at eros',
          style: 'danger',
        },
      ],
    },
  ],
};
