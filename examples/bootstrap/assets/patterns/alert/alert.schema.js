const bootstrapAlertSchema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'Alert',
  description: 'Provide contextual feedback messages for typical user actions with the handful of available and flexible alert messages.',
  required: ['message'],
  properties: {
    message: {
      type: 'string',
      title: 'Text',
    },
    type: {
      title: 'Type',
      type: 'string',
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
      default: 'primary',
    }
  },
  examples: [
    {
      message: 'Success - something went right.',
      type: 'success'
    },
    {
      message: 'Warning - something went fishy.',
      type: 'warning'
    },
    {
      message: 'Error - something went wrong.',
      type: 'error'
    },
    {
      message: 'Info - Just a little FYI.',
      type: 'alert'
    },
  ],
};

const materialAlertSchema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'Alert',
  description: 'Provide contextual feedback messages for typical user actions with the handful of available and flexible alert messages.',
  required: ['message'],
  properties: {
    message: {
      type: 'string',
      title: 'Text',
    },
  },
  examples: [
    {
      message: 'Success - something went right.',
    },
    {
      message: 'Warning - something went fishy.',
    },
    {
      message: 'Error - something went wrong.',
    },
    {
      message: 'Info - Just a little FYI.',
    },
  ],
};

module.exports = {
  bootstrapAlertSchema,
  materialAlertSchema,
};
