const { bootstrapAlertSchema, materialAlertSchema } = require('./alert.schema');
const {
  bootstrap,
  material
} = require('../../../bedrock.asset-sets');

module.exports = {
  id: 'alert',
  templates: [
    {
      alias: '@components/alert.twig',
      path: './alert.twig',
      id: 'alert-twig',
      title: 'Alert Bootstrap - Twig',
      docPath: './README-twig.md',
      schema: bootstrapAlertSchema,
      assetSets: [bootstrap],
    },
    {
      alias: '@components/alert-material.twig',
      path: './alert-material.twig',
      id: 'alert-material-twig',
      title: 'Alert Material - Twig',
      docPath: './README-twig.md',
      schema: materialAlertSchema,
      assetSets: [material],
    },
    {
      alias: '@components/alert.html',
      path: './alert.html',
      id: 'alert-html',
      title: 'Alert - Html',
      docPath: './README-html.md',
      assetSets: [bootstrap],
    },
  ],
};
