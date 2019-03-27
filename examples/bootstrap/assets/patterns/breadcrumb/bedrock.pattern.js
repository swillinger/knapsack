const schema = require('./breadcrumb.schema');

module.exports = {
  id: 'breadcrumb',
  templates: [
    {
      alias: '@components/breadcrumb.twig',
      path: './breadcrumb.twig',
      id: 'breadcrumb-twig',
      title: 'Breadcrumb - Twig',
      docPath: './README-twig.md',
      schema,
    },
    {
      alias: '@components/breadcrumb.html',
      path: './breadcrumb.html',
      id: 'breadcrumb-html',
      title: 'Breadcrumb - Html',
      docPath: './README-html.md',
    },
  ],
};
