module.exports = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'Table',
  description: 'Display organized data.',
  required: ['message'],
  properties: {
    dark: {
      type: 'boolean',
      title: 'Dark Mode',
      description: 'Adds utility class to turn table dark with light text',
      default: false,
    },
    striped: {
      type: 'boolean',
      title: 'Striped',
      description: 'Adds row striping',
      default: false,
    },
    bordered: {
      type: 'boolean',
      title: 'Bordered',
      description: 'Adds borders to all cells',
      default: false,
    },
    hoverable: {
      type: 'boolean',
      title: 'Hoverable',
      description: 'Adds hover state to all rows',
      default: false,
    },
    caption: {
      type: 'string',
      title: 'Caption',
      description: 'Adds a description underneath the table',
    },
    thead: {
      type: 'object',
      title: 'Table Header',
      properties : {
        colorScheme: {
          type: 'string',
          title: 'Color Scheme Override',
          description: 'By default the thead will inherit the table color scheme. This is used to override it.',
          enum: ['light', 'dark'],
          enumNames: ['Light', 'Dark'],
        },
        cells: {
          type: 'array',
          title: 'Cells (Row Items)',
          items: {
            type: 'object',
            title: 'Cell (Row Item)',
            properties: {
              text: {
                type: 'string',
                title: 'Cell text',
              },
            },
          },
        },
      },
    },
    tbody: {
      type: 'array',
      title: 'Rows',
      items: {
        type: 'object',
        title: 'Row',
        properties: {
          rowColorScheme: {
            title: 'Row Color Scheme Override',
            type: 'string',
            description: 'Overrides default color for the entire row.',
            enum: [
              'primary',
              'secondary',
              'success',
              'danger',
              'warning',
              'alert',
              'light',
              'dark',
            ],
            enumNames: [
              'Primary',
              'Secondary',
              'Success',
              'Danger',
              'Warning',
              'Alert',
              'Light',
              'Dark',
            ],
          },
          rowHeader: {
            type: 'string',
            title: 'Row Label (First Cell)',
          },
          cells: {
            type: 'array',
            title: 'Cells (Row Items)',
            items: {
              type: 'object',
              title: 'Cell (Row Item)',
              properties: {
                text: {
                  type: 'string',
                  title: 'Cell text',
                },
              },
            },
          },
        },
      },
    },
  },
  examples: [
    {
      striped: true,
      hoverable: true,
      thead: {
        cells: [
          {
            text: '#',
          },
          {
            text: 'First',
          },
          {
            text: 'Last',
          },
          {
            text: 'Handle',
          },
        ],
      },
      tbody: [
        {
          rowHeader: '1',
          cells: [
            {
              text: 'Mark',
            },
            {
              text: 'Otto',
            },
            {
              text: '@mdo',
            },
          ],
        },
        {
          rowHeader: '2',
          cells: [
            {
              text: 'Jacob',
            },
            {
              text: 'Thornton',
            },
            {
              text: '@fbt',
            },
          ],
        },
        {
            rowHeader: '3',
            cells: [
            {
              text: 'Larry',
            },
            {
              text: 'the Bird',
            },
            {
              text: '@twitter',
            },
          ],
        },
      ],
    },
    {
      striped: true,
      hoverable: true,
      bordered: true,
      thead: {
        colorScheme: 'dark',
        cells: [
          {
            text: '#',
          },
          {
            text: 'First',
          },
          {
            text: 'Last',
          },
          {
            text: 'Handle',
          },
        ],
      },
      tbody: [
        {
          rowHeader: '1',
          rowColorScheme: 'danger',
          cells: [
            {
              text: 'Mark',
            },
            {
              text: 'Otto',
            },
            {
              text: '@mdo',
            },
          ],
        },
        {
          rowHeader: '2',
          rowColorScheme: 'primary',
          cells: [
            {
              text: 'Jacob',
            },
            {
              text: 'Thornton',
            },
            {
              text: '@fbt',
            },
          ],
        },
        {
          rowHeader: '3',
          rowColorScheme: 'warning',
          cells: [
            {
              text: 'Larry',
            },
            {
              text: 'the Bird',
            },
            {
              text: '@twitter',
            },
          ],
        },
      ],
    },
  ],
};
