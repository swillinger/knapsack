const schema = require('./list-group.schema');

module.exports = {
  id: 'list-group',
  templates: [
    {
      alias: '@components/list-group.twig',
      path: './list-group.twig',
      id: 'list-group-twig',
      title: 'List Group - Twig',
      docPath: './README-twig.md',
      schema,
    },
    {
      alias: '@components/list-group.html',
      path: './list-group.html',
      id: 'list-group-html',
      title: 'List Group - Html',
      docPath: './README-html.md',
    },
  ],
};
