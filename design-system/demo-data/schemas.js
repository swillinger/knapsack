export const basicSchema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'Basic Schema',
  required: ['text'],
  properties: {
    text: {
      title: 'Text',
      type: 'string',
    },
    textarea: {
      title: 'Text Area',
      type: 'string',
      description: 'This is a text area, where you might write a lot of text.',
    },
    select: {
      title: 'Select',
      type: 'string',
      description: 'Select one of the options',
      default: 'option1',
      enum: ['option1', 'option1', 'superlongoptionnumberthree', 'option4'],
      enumNames: [
        'Option #1',
        'Option #2',
        'Super Super Super Long Option Number Three',
        'Option #4',
      ],
    },
    radio: {
      title: 'Radio',
      type: 'string',
      description: 'Choose one option',
      enum: ['small', 'medium', 'large', 'jumbo'],
      enumNames: ['Small', 'Medium', 'Large', 'Jumbo'],
    },
    boolean: {
      title: 'Boolean',
      type: 'boolean',
      description: 'Check me!',
    },
  },
};

export const basicSchemaUi = {
  textarea: {
    'ui:widget': 'textarea',
    'ui:options': {
      rows: 10,
    },
  },
  radio: {
    'ui:widget': 'radio',
  },
};

export const kitchenSinkSchema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'Kitchen Sink Schema',
  required: ['required', 'requiredInfo'],
  properties: {
    text: {
      title: 'Text',
      type: 'string',
      description: 'Text',
    },
    required: {
      title: 'Required Text',
      type: 'string',
    },
    requiredInfo: {
      title: 'Required Text with Info',
      type: 'string',
      description: 'This field is both required, and has information.',
    },
    textarea: {
      title: 'Text Area',
      type: 'string',
      description: 'This is a text area, where you might write a lot of text.',
    },
    number: {
      title: 'Number',
      type: 'number',
      description: 'This is number input field.',
    },
    integer: {
      title: 'Integer;',
      type: 'integer',
      description: 'This is an integer input field.',
    },
    email: {
      title: 'Email',
      type: 'string',
      description: 'Email',
    },
    password: {
      title: 'Password',
      type: 'string',
      description: 'Choose a strong password',
    },
    url: {
      title: 'URL',
      type: 'string',
      description: 'URL',
    },
    dataUrl: {
      title: 'File Upload',
      type: 'string',
      format: 'data-url',
      description: 'This field allows you to upload a file from your computer.',
    },
    date: {
      title: 'Date',
      type: 'string',
      description: 'Use your keyboard or mouse to select a date',
    },
    dateTime: {
      title: 'Date & Time',
      type: 'string',
      description: 'Date & Time',
    },
    select: {
      title: 'Select',
      type: 'string',
      description: 'Select',
      default: 'option1',
      enum: ['option1', 'option1', 'superlongoptionnumberthree', 'option4'],
      enumNames: [
        'Option #1',
        'Option #2',
        'Super Super Super Long Option Number Three That Goes On Forever and Ever',
        'Option #4',
      ],
    },
    radio: {
      title: 'Radio',
      type: 'string',
      description: 'Radio',
      enum: ['small', 'medium', 'large', 'jumbo'],
      enumNames: ['Small', 'Medium', 'Large', 'Jumbo'],
    },
    boolean: {
      title: 'Boolean',
      type: 'boolean',
      description: 'Check me!',
    },
    color: {
      title: 'Color Picker',
      type: 'string',
      description: 'Color',
    },
    numberUpdown: {
      title: 'Number Up/Down',
      type: 'number',
      description: 'Number Up/Down',
    },
    numberRange: {
      title: 'Number Range',
      type: 'number',
      description: 'Number Range',
    },
    disabledSelect: {
      title: 'Disabled Select',
      type: 'string',
      description: 'Disabled Select',
      default: 'option1',
      enum: ['option1', 'option1', 'superlongoptionnumberthree', 'option4'],
      enumNames: [
        'Option #1',
        'Option #2',
        'Super Super Super Long Option Number Three That Goes On Forever and Ever',
        'Option #4',
      ],
    },
    disabledRadio: {
      title: 'Disabled Radio',
      type: 'string',
      description: 'Disabled Radio',
      enum: ['small', 'medium', 'large', 'jumbo'],
      enumNames: ['Small', 'Medium', 'Large', 'Jumbo'],
    },
    multipleChoices: {
      title: 'Multiple Choices',
      type: 'object',
      properties: {
        option1: {
          title: 'Option 1',
          type: 'boolean',
        },
        option2: {
          title: 'Option 2',
          type: 'boolean',
        },
        option3: {
          title: 'Option 3',
          type: 'boolean',
        },
        option4: {
          title: 'Option 4',
          type: 'boolean',
        },
      },
    },
  },
};

export const kitchenSinkSchemaUi = {
  textarea: {
    'ui:widget': 'textarea',
    'ui:options': {
      rows: 6,
    },
  },
  email: {
    'ui:widget': 'email',
  },
  password: {
    'ui:widget': 'password',
  },
  url: {
    'ui:widget': 'uri',
  },
  date: {
    'ui:widget': 'date',
  },
  dateTime: {
    'ui:widget': 'date-time',
  },
  radio: {
    'ui:widget': 'radio',
  },
  color: {
    'ui:widget': 'color',
  },
  numberUpdown: {
    'ui:widget': 'updown',
  },
  numberRange: {
    'ui:widget': 'range',
  },
  disabledSelect: {
    'ui:disabled': true,
  },
  disabledRadio: {
    'ui:widget': 'radio',
    'ui:disabled': true,
  },
  multipleChoices: {
    'ui:widget': 'checkboxes',
    'ui:options': {
      inline: true,
    },
  },
};

export const nestedSchema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'Grandparent',
  properties: {
    title: {
      title: 'Title',
      type: 'string',
      description: 'Main heading of media block.',
    },
    firstChild: {
      type: 'array',
      title: 'Parent',
      description: 'Parent',
      items: {
        $schema: 'http://json-schema.org/draft-07/schema',
        type: 'object',
        title: 'Parent',
        description: '',
        properties: {
          text: {
            title: 'Text',
            type: 'string',
            description: 'Button Text',
          },
          secondChild: {
            type: 'array',
            title: 'Child',
            description: 'Child',
            items: {
              $schema: 'http://json-schema.org/draft-07/schema',
              type: 'object',
              title: 'Child',
              description: '',
              properties: {
                text: {
                  title: 'Text',
                  type: 'string',
                  description: 'Button Text',
                },
                radio: {
                  title: 'Radio',
                  type: 'string',
                  description: 'Radio',
                  enum: ['small', 'medium', 'large', 'jumbo'],
                  enumNames: ['Small', 'Medium', 'Large', 'Jumbo'],
                },
                thirdChild: {
                  type: 'array',
                  title: 'Grandchild',
                  description: 'Grandchild',
                  items: {
                    $schema: 'http://json-schema.org/draft-07/schema',
                    type: 'object',
                    title: 'Grandchild',
                    description: '',
                    properties: {
                      text: {
                        title: 'Text',
                        type: 'string',
                        description: 'Button Text',
                      },
                      select: {
                        title: 'Select',
                        type: 'string',
                        description: 'Select',
                        default: 'option1',
                        enum: [
                          'option1',
                          'option1',
                          'superlongoptionnumberthree',
                          'option4',
                        ],
                        enumNames: [
                          'Option #1',
                          'Option #2',
                          'Super Super Super Long Option Number Three That Goes On Forever and Ever',
                          'Option #4',
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const bootstrapButtonSchema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'Button',
  description: 'A Button for clicking!',
  required: ['text', 'url'],
  properties: {
    text: {
      type: 'string',
      title: 'Text',
    },
    url: {
      type: 'string',
      title: 'Url',
    },
    style: {
      type: 'string',
      title: 'Style',
      default: 'primary',
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
    size: {
      type: 'string',
      title: 'Size',
      default: 'md',
      enum: ['sm', 'md', 'lg'],
      enumNames: ['Small', 'Default', 'Large'],
    },
    disabled: {
      type: 'boolean',
      title: 'Disabled',
      default: false,
    },
    outlined: {
      type: 'boolean',
      title: 'Outlined',
      default: false,
    },
  },
  examples: [
    {
      text: 'Button',
      url: '#',
      style: 'primary',
    },
  ],
};

const { text, url, style } = bootstrapButtonSchema.properties;

export const bootstrapCardSchema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'Card',
  description: 'A Card for containing content',
  required: ['cardTitle', 'cardBody'],
  properties: {
    cardHeader: {
      type: 'string',
      title: 'Card Header Text',
    },
    cardTitle: {
      type: 'string',
      title: 'Body Title',
    },
    cardSubTitle: {
      type: 'string',
      title: 'Body Sub Title',
    },
    cardBody: {
      type: 'string',
      title: 'Card Body Text',
    },
    textAlign: {
      type: 'string',
      title: 'Text Align',
      enum: ['left', 'center', 'right'],
      enumNames: ['Left', 'Center', 'Right'],
      default: 'left',
    },
    imgSrc: {
      type: 'string',
      title: 'Image Source',
    },
    imgAlt: {
      type: 'string',
      title: 'Image Alt Text',
    },
    button: {
      type: 'object',
      title: 'Button',
      properties: {
        text,
        url,
        style,
      },
    },
    links: {
      type: 'array',
      title: 'Links',
      items: {
        type: 'object',
        title: 'Link',
        required: ['linkText', 'linkUrl'],
        properties: {
          linkText: {
            type: 'string',
            title: 'Link Text',
          },
          linkUrl: {
            type: 'string',
            title: 'Link URL',
          },
        },
      },
    },
  },
  examples: [
    {
      cardTitle: 'Card Title',
      cardBody:
        "Some quick example text to build on the card title and make up the bulk of the card's content.",
      imgSrc: '/images/demoImg2.jpg',
      imgAlt: 'Nature Picture',
      button: {
        text: 'Go somewhere',
        url: '#',
        style: 'primary',
      },
    },
    {
      cardHeader: 'Card Header',
      cardTitle: 'Card Title',
      cardSubTitle: 'Card SubTitle',
      cardBody:
        "Some quick example text to build on the card title and make up the bulk of the card's content.",
      list: {
        flush: true,
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
      links: [
        {
          linkText: 'Link 1',
          linkUrl: '#',
        },
        {
          linkText: 'Link 2',
          linkUrl: '#',
        },
      ],
    },
  ],
};
