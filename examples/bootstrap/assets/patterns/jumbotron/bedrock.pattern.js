const schema = require('./jumbotron.schema');

module.exports = {
  id: 'jumbotron',
  templates: [
    {
      alias: '@components/jumbotron.html',
      path: './jumbotron.html',
      id: 'jumbotron-html',
      title: 'Jumbotron - Html',
      docPath: './README-html.md',
    },
    {
      alias: '@components/jumbotron.twig',
      path: './jumbotron.twig',
      id: 'jumbotron-twig',
      title: 'Jumbotron - Twig',
      docPath: './README-twig.md',
      schema,
    },
  ],
};
