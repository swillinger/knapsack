const schema = require('./jumbotron.schema');
const {
  bootstrap,
  material
} = require('../../../knapsack.asset-sets');

module.exports = {
  id: 'jumbotron',
  templates: [
    {
      alias: '@components/jumbotron.twig',
      path: './jumbotron.twig',
      id: 'jumbotron-twig',
      title: 'Jumbotron - Twig',
      docPath: './README-twig.md',
      schema,
      assetSets: [bootstrap],
    },
    {
      alias: '@components/jumbotron.html',
      path: './jumbotron.html',
      id: 'jumbotron-html',
      title: 'Jumbotron - Html',
      docPath: './README-html.md',
      assetSets: [bootstrap],
    },
  ],
};
