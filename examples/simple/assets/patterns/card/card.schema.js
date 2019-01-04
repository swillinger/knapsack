const buttonSchema = require('../button/button.schema');

module.exports = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'Card',
  description: 'A Card that powers the internet',
  required: ['title', 'body'],
  properties: {
    title: {
      type: 'string',
      title: 'Title',
    },
    body: {
      type: 'string',
      title: 'Body',
    },
    img: {
      type: 'string',
      title: 'Image Path',
    },
    align: {
      title: 'Image Alignment',
      type: 'string',
      enum: ['top', 'right', 'bottom', 'left'],
      default: 'left',
    },
    buttons: {
      title: 'Buttons',
      type: 'array',
      items: buttonSchema,
    },
  }
};
