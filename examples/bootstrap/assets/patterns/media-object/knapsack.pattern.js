const schema = require('./media-object.schema');
const {
  bootstrap,
} = require('../../../bedrock.asset-sets');

module.exports = {
  id: 'media-object',
  templates: [
    {
      alias: '@components/media-object.twig',
      path: './media-object.twig',
      id: 'media-object-twig',
      title: 'Media Object - Twig',
      docPath: './README-twig.md',
      schema,
      assetSets: [bootstrap],
    },
    {
      alias: '@components/media-object.html',
      path: './media-object.html',
      id: 'media-object-html',
      title: 'Media Object - Html',
      docPath: './README-html.md',
      assetSets: [bootstrap],
    },
  ],
};
