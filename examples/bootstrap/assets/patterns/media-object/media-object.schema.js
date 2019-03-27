module.exports = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'media-object',
  description: 'A Media Object',
  required: ['text', 'url'],
  properties: {
    mediaObjects: {
      type: 'array',
      title: 'Media Objects',
      items: {
        type: 'object',
        title: 'Media Object',
        required: ['mediaHeading', 'mediaBody', 'mediaImg'],
        properties: {
          mediaHeading: {
            type: 'string',
            title: 'Media Object Heading',
          },
          mediaBody: {
            type: 'string',
            title: 'Media Object Body',
          },
          mediaImg: {
            type: 'string',
            title: 'Media Object Image',
          },
          mediaAlignment: {
            type: 'string',
            title: 'Media Alignment',
            enum: ['center', 'end', 'start'],
            enumNames: ['Center', 'Bottom', 'Top'],
            default: 'start',
          },
          nestedObjects: {
            type: 'array',
            title: 'Nested Media Objects',
            items: {
              type: 'object',
              title: 'Nested Media Object',
              required: ['nestedHeading', 'nestedBody', 'nestedImg'],
              properties: {
                nestedHeading: {
                  type: 'string',
                  title: 'Media Object Heading',
                },
                nestedBody: {
                  type: 'string',
                  title: 'Media Object Body',
                },
                nestedImg: {
                  type: 'string',
                  title: 'Media Object Image',
                },
                nestedAlignment: {
                  type: 'string',
                  title: 'Media Alignment',
                  enum: ['center', 'end', 'start'],
                  enumNames: ['Center', 'Bottom', 'Top'],
                  default: 'start',
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
      mediaObjects: [
        {
          mediaHeading: 'Media Heading',
          mediaBody: 'Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.',
          mediaImg: 'https://placeimg.com/64/64/nature',
          nestedObjects: [
            {
              nestedHeading: 'Media Heading',
              nestedBody: 'Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.',
              nestedImg: 'https://placeimg.com/64/64/nature',
            }
          ]
        },
      ],
    },
    {
      mediaObjects: [
        {
          mediaHeading: 'Media Heading',
          mediaBody: 'Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.',
          mediaImg: 'https://placeimg.com/64/64/nature',
        },
        {
          mediaHeading: 'Media Heading',
          mediaBody: 'Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.',
          mediaImg: 'https://placeimg.com/64/64/nature',
        },
        {
          mediaHeading: 'Media Heading',
          mediaBody: 'Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.',
          mediaImg: 'https://placeimg.com/64/64/nature',
        },
      ],
    },
  ],
};
