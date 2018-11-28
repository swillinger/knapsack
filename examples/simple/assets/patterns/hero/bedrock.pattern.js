const schema = require('./hero.schema');

module.exports = {
  id: 'hero',
  templates: [
    {
      name: '@components/hero.twig',
      schema,
    },
  ],
};
