const patternSchema = require('./pattern.schema');
const patternMeta = require('./pattern-meta.schema.json');

module.exports = {
  ...patternSchema,
  title: 'PatternWithMetaSchema',
  properties: {
    ...patternSchema.properties,
    meta: patternMeta,
  },
};
