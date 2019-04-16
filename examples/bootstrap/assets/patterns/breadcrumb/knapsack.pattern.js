const schema = require('./breadcrumb.schema');
const {
  bootstrap,
  material
} = require('../../../knapsack.asset-sets');

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
      assetSets: [bootstrap],
    },
    {
      alias: '@components/breadcrumb.html',
      path: './breadcrumb.html',
      id: 'breadcrumb-html',
      title: 'Breadcrumb - Html',
      docPath: './README-html.md',
      assetSets: [bootstrap],
    },
  ],
};
