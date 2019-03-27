const buttonSchema = require('../button/button.schema');

const { text, url, style } = buttonSchema.properties;


module.exports = {
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
    list: {
      type: 'array',
      title: 'List',
      items: {
        type: 'object',
        title: 'List Item',
        required: ['listText'],
        properties: {
          listText: {
            type: 'string',
            title: 'List Text',
          },
        },
      },
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
      cardBody: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
      imgSrc: 'https://placeimg.com/640/480/nature',
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
      cardBody: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
      list: [
        {
          listText: 'List Item 1',
        },
        {
          listText: 'List Item 2',
        },
        {
          listText: 'List Item 3',
        },
      ],
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
