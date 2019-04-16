const { styleDictionaryKnapsackFormat } = require('@basalt/knapsack');
const StyleDictionary = require('style-dictionary');
const template = require('lodash.template');
const { readFileSync } = require('fs');
const { join } = require('path');

StyleDictionary.registerFormat(styleDictionaryKnapsackFormat);

StyleDictionary.registerFormat({
  name: 'custom-sass-map-flat',
  formatter: template(
    readFileSync(
      join(__dirname, './scripts/sass-map-flat.template'),
    ),
  ),
});

const buildPath = './assets/design-tokens/dist/';
const prefix = 'bs';

module.exports = {
  source: ['assets/design-tokens/**/*.{json,js}'],
  platforms: {
    scss: {
      prefix,
      transforms: [
        'attribute/cti',
        'name/cti/kebab',
        'time/seconds',
        'content/icon',
        'color/css',
      ],
      buildPath,
      files: [
        {
          destination: 'design-tokens.scss',
          format: 'scss/map-deep',
        },
        {
          destination: 'colors.scss',
          format: 'custom-sass-map-flat',
          filter: prop => prop.attributes.category === 'color',
          options: {
            mapVarName: 'tokens-color',
          },
        },
      ],
    },
    js: {
      transforms: ['name/cti/camel'],
      buildPath,
      prefix,
      files: [
        {
          destination: 'design-tokens.json',
          format: 'json/flat',
        },
        // {
        //   destination: 'design-tokens-deep.json',
        //   format: 'json',
        // },
      ],
    },
    knapsack: {
      transforms: ['attribute/cti', 'name/cti/kebab'],
      buildPath,
      prefix,
      files: [
        {
          destination: 'knapsack-design-tokens.json',
          format: 'knapsack',
        },
      ],
    },
  },
};
