const schema = require('./button.schema');

module.exports = {
  id: 'button',
  metaFilePath: './meta.json',
  templates: [
    {
      name: '@components/button.twig',
      schema,
    },
  ],
};
