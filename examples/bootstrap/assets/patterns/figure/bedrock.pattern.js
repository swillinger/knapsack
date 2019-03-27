const schema = require('./figure.schema');

module.exports = {
  id: 'figure',
  templates: [
    {
      alias: '@components/figure.twig',
      path: './figure.twig',
      id: 'figure-twig',
      title: 'Figure - Twig',
      docPath: './README-twig.md',
      schema,
    },
    {
      alias: '@components/figure.html',
      path: './figure.html',
      id: 'figure-html',
      title: 'Figure - Html',
      docPath: './README-html.md',
    },
  ],
};
