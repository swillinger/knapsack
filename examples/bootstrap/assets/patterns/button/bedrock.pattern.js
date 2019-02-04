const schema = require('./button.schema');

module.exports = {
  id: 'button',
  templates: [
    {
      alias: '@components/button.html',
      path: './button.html',
      id: 'button-html',
      title: 'Button - Html',
      docPath: './README-html.md',
    },
    // {
    //   alias: '@components/button.html',
    //   path: './button.html',
    //   id: 'button-html',
    //   title: 'Button - Html',
    //   docPath: './README-html.md',
    //   schema,
    // },
  ],
};
