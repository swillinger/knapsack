const schema = require('./card.schema');

module.exports = {
  id: 'card',
  metaFilePath: './meta.json',
  templates: [
    {
      name: '@patterns/card.twig',
      schema,
    },
  ],
};
