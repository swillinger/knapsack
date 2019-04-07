const { materialListGroupSchema, bootstrapListGroupSchema } = require('./list-group.schema');
const {
  bootstrap,
  material
} = require('../../../bedrock.asset-sets');

module.exports = {
  id: 'list-group',
  templates: [
    {
      alias: '@components/list-group.twig',
      path: './list-group.twig',
      id: 'list-group-twig',
      title: 'List Group - Twig',
      docPath: './README-twig.md',
      schema: bootstrapListGroupSchema,
      assetSets: [bootstrap],
    },
    {
      alias: '@components/list-group-material.twig',
      path: './list-group-material.twig',
      id: 'list-group-material-twig',
      title: 'List Group Material - Twig',
      docPath: './README-twig.md',
      schema: materialListGroupSchema,
      assetSets: [material],
    },
    {
      alias: '@components/list-group.html',
      path: './list-group.html',
      id: 'list-group-html',
      title: 'List Group - Html',
      docPath: './README-html.md',
      assetSets: [bootstrap],
    },
  ],
};
