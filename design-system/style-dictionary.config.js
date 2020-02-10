const StyleDictionary = require('style-dictionary');
const { styleDictionaryKnapsackFormat } = require('@knapsack/core');

function variablesWithPrefix(prefix, properties, commentStyle) {
  return properties
    .map(function(prop) {
      let toRetProp = `${prefix + prop.name}: ${
        prop.attributes.category === 'asset' ? `"${prop.value}"` : prop.value
      };`;

      if (prop.comment) {
        if (commentStyle === 'short') {
          toRetProp = toRetProp.concat(` // ${prop.comment}`);
        } else {
          toRetProp = toRetProp.concat(` /* ${prop.comment} */`);
        }
      }

      return toRetProp;
    })
    .filter(function(strVal) {
      return !!strVal;
    })
    .join('\n');
}

StyleDictionary.registerFormat(styleDictionaryKnapsackFormat);
StyleDictionary.registerFormat({
  name: 'custom-css/variables',
  formatter(dictionary) {
    return `:root body {\n${variablesWithPrefix(
      '  --',
      dictionary.allProperties,
    )}\n}\n`;
  },
});

module.exports = {
  source: ['src/design-tokens/**/*.{json,js}'],
  platforms: {
    css: {
      prefix: '',
      transforms: ['attribute/cti', 'name/cti/kebab', 'color/css'],
      buildPath: './dist/',
      files: [
        {
          destination: 'ks-design-tokens.css',
          format: 'custom-css/variables',
        },
      ],
    },
    js: {
      transforms: ['name/cti/camel'],
      buildPath: './dist/',
      prefix: '',
      files: [
        {
          destination: 'ks-design-tokens.json',
          format: 'json/flat',
        },
        {
          destination: 'ks-design-tokens.js',
          format: 'javascript/es6',
        },
      ],
    },
    knapsack: {
      transforms: ['attribute/cti', 'name/cti/kebab'],
      buildPath: './dist/',
      prefix: '',
      files: [
        {
          destination: 'knapsack-design-tokens.json',
          format: 'knapsack',
        },
      ],
    },
  },
};
