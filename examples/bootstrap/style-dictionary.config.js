const { styleDictionaryBedrockFormat } = require('@basalt/bedrock');
const StyleDictionary = require('style-dictionary');
const template = require('lodash.template');
const { readFileSync } = require('fs');
const { join } = require('path');

StyleDictionary.registerFormat(styleDictionaryBedrockFormat);

StyleDictionary.registerFormat({
  name: 'custom-sass-map-flat',
  formatter: template(
    readFileSync(
      join(__dirname, '../scripts/style-dictionary/sass-map-flat.template'),
    ),
  ),
});

module.exports = {
  source: ['src/core/design-tokens/**/*.{json,js}'],
  platforms: {
    scss: {
      prefix: 'msk',
      transforms: [
        'attribute/cti',
        'name/cti/kebab',
        'time/seconds',
        'content/icon',
        'color/css',
      ],
      buildPath: './src/core/dist/',
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
      buildPath: './src/core/dist/',
      prefix: 'msk',
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
    bedrock: {
      transforms: ['attribute/cti', 'name/cti/kebab'],
      buildPath: './src/core/dist/',
      prefix: 'msk',
      files: [
        {
          destination: 'bedrock-design-tokens.json',
          format: 'bedrock',
        },
      ],
    },
  },
};
