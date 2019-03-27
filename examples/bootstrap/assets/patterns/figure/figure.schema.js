module.exports = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'Figure',
  description: 'Display related images and text with the figure component in Bootstrap.',
  required: [],
  properties: {
    bodyText: {
      type: 'string',
      title: 'Body Text',
    },
    imgSrc: {
      type: 'string',
      title: 'Image Source',
    },
    imgAlt: {
      type: 'string',
      title: 'Image Alt Text',
    },
    textPosition: {
      type: 'string',
      title: 'Text Position',
      enum: ['left', 'right'],
      enumNames: ['Left', 'Right'],
      default: 'Left',
    },
  },
  examples: [
    {
      bodyText: 'A caption for the above image.',
      imgSrc: 'https://placeimg.com/400/300/nature',
      imgAlt: 'A nature picture',
      textPosition: 'left',
    },
  ],
};
