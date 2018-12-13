const schema = require('./card.schema');

module.exports = {
  id: 'super-card',
  templates: [
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
