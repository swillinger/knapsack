const { bootstrapButtonSchema, materialButtonSchema } = require('./button.schema');
const {
  bootstrap,
  material,
} = require('../../../bedrock.asset-sets');

module.exports = {
  id: 'button',
  templates: [
    {
      alias: '@components/button.twig',
      path: './button.twig',
      id: 'button-twig',
      title: 'Button Bootstrap - Twig',
      docPath: './README-twig.md',
      schema: bootstrapButtonSchema,
      assetSets: [bootstrap],
    },
    {
      alias: '@components/button-material.twig',
      path: './button-material.twig',
      id: 'button-material-twig',
      title: 'Button Material - Twig',
      docPath: './README-twig.md',
      schema: materialButtonSchema,
      assetSets: [material],
    },
    {
      alias: '@components/button.html',
      path: './button.html',
      id: 'button-html',
      title: 'Button Bootstrap - Html',
      docPath: './README-html.md',
      assetSets: [bootstrap],
    },
  ],
};
