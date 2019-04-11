const { bootstrapCardGridSchema, materialCardGridSchema } = require('./card-grid.schema');
const {
  bootstrap,
  material
} = require('../../../knapsack.asset-sets');

module.exports = {
  id: 'card-grid',
  templates: [
    {
      alias: '@components/card-grid.twig',
      path: './card-grid.twig',
      id: 'twig',
      title: 'Card Grid Bootstrap - Twig',
      docPath: './README-twig.md',
      schema: bootstrapCardGridSchema,
      assetSets: [bootstrap],
    },
    {
      alias: '@components/card-grid-material.twig',
      path: './card-grid-material.twig',
      id: 'twig-material',
      title: 'Card Grid Material - Twig',
      docPath: './README-twig.md',
      schema: materialCardGridSchema,
      assetSets: [material],
    },
    {
      alias: '@components/card-grid.html',
      path: './card-grid.html',
      id: 'html',
      title: 'Card Grid - Html',
      docPath: './README-html.md',
      assetSets: [bootstrap],
    },
  ],
};
