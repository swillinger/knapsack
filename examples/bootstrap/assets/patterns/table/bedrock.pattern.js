const schema = require('./table.schema');

module.exports = {
  id: 'table',
  templates: [
    {
      alias: '@components/table.twig',
      path: './table.twig',
      id: 'table-twig',
      title: 'Table - Twig',
      docPath: './README-twig.md',
      schema,
    },
    {
      alias: '@components/table.html',
      path: './table.html',
      id: 'table-html',
      title: 'Table - Html',
      docPath: './README-html.md',
    },
  ],
};
