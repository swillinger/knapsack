
module.exports = {
  id: 'home-page',
  templates: [
    {
      alias: '@pages/home-page.twig',
      path: './home-page.twig',
      id: 'twig',
      title: 'Twig',
      schema: {
        title: 'Home Page',
        type: 'object',
        // properties: {},
        examples: [{}]
      },
    },
  ],
};
