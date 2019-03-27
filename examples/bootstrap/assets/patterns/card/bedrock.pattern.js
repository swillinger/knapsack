const schema = require('./card.schema');

module.exports = {
  id: 'card',
  templates: [
    {
      alias: '@components/card.html',
      path: './card.html',
      id: 'html',
      title: 'Card - Html',
      docPath: './README-html.md',
    },
    {
      alias: '@components/card.twig',
      path: './card.twig',
      id: 'twig',
      title: 'Card - Twig',
      docPath: './README-twig.md',
      schema,
    },
  ],
};
