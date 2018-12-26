const schema = require('./card.schema');

module.exports = {
  id: 'card',
  templates: [
    {
      path: './card.jsx',
      id: 'react',
      title: 'React',
      schema,
    },
    {
      alias: '@components/card.twig',
      path: './card.twig',
      id: 'twig',
      title: 'Twig',
      schema,
    },
    {
      path: './card.html',
      id: 'html',
      title: 'HTML',
      schema: {
        ...schema,
        required: [],
        properties: {},
      },
    },
  ],
};
