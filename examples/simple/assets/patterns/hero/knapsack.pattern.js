const schema = require('./hero.schema');

module.exports = {
  id: 'hero',
  templates: [
    {
      alias: '@components/hero.twig',
      path: './hero.twig',
      id: 'twig',
      title: 'Twig',
      schema,
    },
  ],
};
