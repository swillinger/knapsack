const templates = require('./pattern-templates.schema.json');

module.exports = {
  title: 'PatternSchema',
  type: 'object',
  required: ['id', 'templates'],
  additionalProperties: false,
  properties: {
    id: {
      title: 'Id',
      type: 'string',
      description:
        "Identifying machine friendly name of pattern. Usually the 'Block' in 'BEM'.",
    },
    templates,
  },
};
