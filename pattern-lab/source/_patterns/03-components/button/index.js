const { text } = require('@basalt/demo-data');
const schema = require('./button-schema.json');

schema.examples = [
  {
    text: text(),
    url: 'http://www.basalt.io',
    size: 'small',
    color: 'blue--light',
  },
];

const meta = {
  id: 'button',
  title: schema.title,
  type: 'component',
  template: '@components/_button.twig',
  schema,
};

module.exports = {
  meta,
};
