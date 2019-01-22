const schema = require('./card.schema');

module.exports = {
  id: 'card',
  templates: [
    {
      alias: '@components/card.twig',
      path: './card.twig',
      id: 'twig',
      title: 'Twig',
      docPath: './readme.md',
      schema,
    },
    {
      path: './card.html',
      id: 'html',
      title: 'HTML',
      docPath: './readme2.md',
      schema: {
        ...schema,
        required: [],
        properties: {},
      },
    },
  ],
};
