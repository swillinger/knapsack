const schema = require('./alert.schema');

module.exports = {
  id: 'alert',
  templates: [
    {
      alias: '@components/alert.twig',
      path: './alert.twig',
      id: 'alert-twig',
      title: 'Alert - Twig',
      docPath: './README-twig.md',
      schema,
    },
    {
      alias: '@components/alert.html',
      path: './alert.html',
      id: 'alert-html',
      title: 'Alert - Html',
      docPath: './README-html.md',
    },
  ],
};
