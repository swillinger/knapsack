const { bootstrapNavSchema, materialNavSchema } = require('./nav.schema');
const {
  bootstrap,
  material
} = require('../../../knapsack.asset-sets');

module.exports = {
  id: 'nav',
  templates: [
    {
      alias: '@components/nav.twig',
      path: './nav.twig',
      id: 'nav-twig',
      title: 'Navbar Bootstrap - Twig',
      docPath: './README-twig.md',
      schema: bootstrapNavSchema,
      assetSets: [bootstrap],
    },
    {
      alias: '@components/nav-material.twig',
      path: './nav-material.twig',
      id: 'nav-material-twig',
      title: 'Navbar Material - Twig',
      docPath: './README-twig.md',
      schema: materialNavSchema,
      assetSets: [material],
    },
    {
      alias: '@components/nav.html',
      path: './nav.html',
      id: 'nav-html',
      title: 'Navbar Bootstrap - Html',
      docPath: './README-html.md',
      assetSets: [bootstrap],
    },
  ],
};
