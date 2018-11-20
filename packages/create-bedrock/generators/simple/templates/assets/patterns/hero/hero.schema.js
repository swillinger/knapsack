const { image } = require('@basalt/demo-data');

module.exports = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'Hero',
  description: 'A Hero that shows the things',
  required: ['title', 'body', 'img'],
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
  },
  examples: [
    {
      title: "I'm a Hero!",
      body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit..',
      img: image(),
    },
  ],
};
