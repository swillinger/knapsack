const { bootstrapButtonSchema, materialButtonSchema } = require('../button/button.schema');
const { bootstrapListGroupSchema } = require('../list-group/list-group.schema');

const { text, url, style } = bootstrapButtonSchema.properties;
const materialButton = materialButtonSchema.properties;

const bootstrapCardSchema = {
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
    list: bootstrapListGroupSchema,
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
      cardBody: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
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

const materialCardSchema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'Card',
  description: 'A Card for containing content',
  required: ['cardTitle', 'cardBody', 'imgSrc'],
  properties: {
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
    imgSrc: {
      type: 'string',
      title: 'Image Source',
    },
    buttons: {
      type: 'array',
      title: 'Buttons',
      items: {
        type: 'object',
        title: 'Button',
        properties: materialButton,
      },
    },
  },
  examples: [
    {
      cardTitle: 'Card Title',
      cardSubTitle: 'Card SubTitle',
      cardBody: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
      imgSrc: '/images/demoImg1.jpg',
      buttons: [
        {
          text: 'Go somewhere',
          url: '#',
          variant: 'text',
        },
      ],
    },
    {
      cardTitle: 'Card Title',
      cardSubTitle: 'Card SubTitle',
      imgSrc: '/images/demoImg4.jpg',
      cardBody: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
    },
  ],
};

module.exports = {
  bootstrapCardSchema,
  materialCardSchema,
};
