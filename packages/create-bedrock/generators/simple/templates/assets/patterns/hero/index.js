const schema = require('./hero.schema');

module.exports = {
  id: 'hero',
  metaFilePath: './meta.json',
  templates: [
    {
      name: '@components/hero.twig',
      schema,
    },
  ],
};
