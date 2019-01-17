const schema = require('./card.schema');

module.exports = {
  id: 'card',
  templates: [
    {
      path: './card.jsx',
      id: 'react',
      title: 'React',
      doc: './readme-react.md',
      demoSize: 'l',
      schema,
    },
    {
      alias: '@components/card.twig',
      path: './card.twig',
      id: 'twig',
      title: 'Twig',
      demoSize: 's',
      schema,
    },
    {
      path: './card.html',
      id: 'html',
      title: 'HTML',
      doc: './readme-html.md',
      schema: {
        ...schema,
        required: [],
        properties: {},
      },
    },
  ],
};
