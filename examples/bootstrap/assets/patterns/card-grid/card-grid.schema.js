const { bootstrapCardSchema, materialCardSchema } = require('../card/card.schema');

const bootstrapCardGridSchema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'Card',
  description: 'A Card for containing content',
  required: ['cardTitle', 'cardBody'],
  properties: {
    cards: {
      type: 'array',
      title: 'Cards',
      items: {
        type: 'object',
        title: 'Card',
        properties: bootstrapCardSchema.properties,
      },
    },
  },
  examples: [
    {
      cards: [
        {
          cardTitle: 'Card Title 1',
          cardSubTitle: 'Card SubTitle',
          cardBody: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
          imgSrc: '/images/demoImg4.jpg',
          button: {
            text: 'Go somewhere',
            url: '#',
            style: 'primary',
          },
        },
        {
          cardTitle: 'Card Title 2',
          cardSubTitle: 'Card SubTitle',
          cardBody: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
          imgSrc: '/images/demoImg1.jpg',
          button: {
            text: 'Go somewhere',
            url: '#',
            style: 'secondary',
          },
        },
        {
          cardTitle: 'Card Title 3',
          cardSubTitle: 'Card SubTitle',
          cardBody: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
          imgSrc: '/images/demoImg2.jpg',
          button: {
            text: 'Go somewhere',
            url: '#',
            style: 'warning',
          },
        },
      ],
    },
  ],
};

const materialCardGridSchema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'Card',
  description: 'A Card for containing content',
  required: ['cardTitle', 'cardBody'],
  properties: {
    cards: {
      type: 'array',
      title: 'Cards',
      items: {
        type: 'object',
        title: 'Card',
        properties: materialCardSchema.properties,
      },
    },
  },
  examples: [
    {
      cards: [
        {
          cardTitle: 'Card Title 1',
          cardSubTitle: 'Card SubTitle',
          cardBody: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
          imgSrc: '/images/demoImg1.jpg',
          buttons: [
            {
              text: 'Go somewhere',
              url: '#',
              variant: 'raised',
            },
          ],
        },
        {
          cardTitle: 'Card Title 2',
          cardSubTitle: 'Card SubTitle',
          cardBody: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
          imgSrc: '/images/demoImg2.jpg',
          buttons: [
            {
              text: 'Go somewhere',
              url: '#',
              variant: 'text',
            },
          ],
        },
        {
          cardTitle: 'Card Title 3',
          cardSubTitle: 'Card SubTitle',
          cardBody: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.',
          imgSrc: '/images/demoImg3.jpg',
          buttons: [
            {
              text: 'Go somewhere',
              url: '#',
              variant: 'outlined',
            },
          ],
        },
      ],
    },
  ],
};

module.exports = {
  bootstrapCardGridSchema,
  materialCardGridSchema,
};
