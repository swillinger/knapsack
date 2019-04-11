const { bootstrapCardSchema, materialCardSchema } = require('./card.schema');
const {
  bootstrap,
  material
} = require('../../../knapsack.asset-sets');

module.exports = {
  id: 'card',
  templates: [
    {
      alias: '@components/card.twig',
      path: './card.twig',
      id: 'twig',
      title: 'Card Bootstrap - Twig',
      docPath: './README-twig.md',
      schema: bootstrapCardSchema,
      assetSets: [bootstrap],
    },
    {
      alias: '@components/card-material.twig',
      path: './card-material.twig',
      id: 'twig-material',
      title: 'Card Material - Twig',
      docPath: './README-twig.md',
      schema: materialCardSchema,
      assetSets: [material],
    },
    {
      alias: '@components/card.html',
      path: './card.html',
      id: 'html',
      title: 'Card - Html',
      docPath: './README-html.md',
      assetSets: [bootstrap],
    },
  ],
};
