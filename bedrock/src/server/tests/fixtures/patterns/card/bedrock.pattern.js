const schema = require('./card.schema');

module.exports = {
  id: 'card',
  templates: [
    {
      name: '@components/card.twig',
      schema,
    },
  ],
};
