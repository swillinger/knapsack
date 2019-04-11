const schema = require('./card.schema');

const demoDatas = [
  {
    title: "I'm a Card Title 2",
    body:
      "I'm a body - Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    img: '/images/imagePlaceholder1.png',
  },{
    title: "I'm a Card Title 3",
    body:
      "I'm a body - Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    img: '/images/imagePlaceholder1.png',
  },
];

module.exports = {
  id: 'card',
  templates: [
    {
      alias: '@components/card.twig',
      path: './card.twig',
      id: 'twig',
      title: 'Twig',
      docPath: './readme.md',
      demoDatas,
      schema,
    },
    {
      path: './card.html',
      id: 'html',
      title: 'HTML',
    },
  ],
};
