const schema = require('./card.schema');

module.exports = {
  id: 'card',
  metaFilePath: './meta.json',
  templates: [
    {
      name: '@components/card.twig',
      schema,
    },
  ],
};
