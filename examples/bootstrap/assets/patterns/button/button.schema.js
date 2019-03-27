module.exports = {
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
      enum: [
        'sm',
        'md',
        'lg',
      ],
      enumNames: [
        'Small',
        'Default',
        'Large',
      ],
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
    }
  },
  examples: [
  ],
};
