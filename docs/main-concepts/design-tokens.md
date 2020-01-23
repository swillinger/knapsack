---
title: Design Tokens
---
# **Warning: Doc out of date; below is for v1 (preserved for v2 inspiration)**

Design tokens are named entities for identifying, storing, and accessing the most basic layer of a design system. Design tokens include colors, spacing, typography, animation and other values that make up a design language and are usually accessible in both Javascript and in SCSS.

Assigning core design values to design tokens is an effective way to create a more scalable, maintainable, and intentional system.

Knapsack provides users the ability to organize, view and query design tokens.

## Knapsack Design Token Format

To import design tokens into Knapsack, create a json object with the following structure and assign it to `designTokens.data` in your `knapsack.config.js` file.

```json
{
  "tokens": [
    {
      "value": "#FFFFFF",
      "name": "color-white",
      "category": "colors",
      "tags": [],
      "meta": {}
    },
    ... etc ...
  ]
}
```

Maintaining a flat array of design tokens may not be ideal. We suggest the use of either [Theo](https://www.npmjs.com/package/theo) or [Style Dictionary](https://amzn.github.io/style-dictionary/#/) to assist in the creation of this data.

## Design Tokens From Theo

Knapsack provides a formatter to get your [Theo](https://www.npmjs.com/package/theo) design tokens into Knapsack.

Here is an example of how to convert Theo design tokens with the Knapsack Theo Formatter.

```javascript
// Import required dependencies
const { theoKnapsackFormat } = require('@knapsack/app');
const theo = require('theo');

// Register the Knapsack formatter with your instance of theo
const format = theoKnapsackFormat(theo);

// Generate design token data in a format ready for consumption in `knapsack.config.js`
const designTokenData = theo.convertSync({
   transform: {
     type: 'web',
     file: './path-to-your/tokens.yml',
   },
   format,
 });


// Assign your design token data to `config.designTokens.data`
const config = {
  patterns: ['./patterns/*'],
  newPatternDir: './patterns/',
  designTokens: {
    createCodeSnippet: token => `$${token.name}`,
    data: designTokenData,
  },
  dist: './dist',
  public: './public',
  data: './data',
  ... etc ...
};

module.exports = config;
```

## Design Tokens From Style Dictionary

Knapsack provides a formatter to get your [Style Dictionary](https://amzn.github.io/style-dictionary/#/) design tokens into Knapsack.

Here is an example of how to convert Style Dictionary design tokens with the Knapsack Style Dictionary Formatter.

`style-dictionary.config.js`

```javascript
const { styleDictionaryKnapsackFormat } = require('@knapsack/app');
const StyleDictionary = require('style-dictionary');

StyleDictionary.registerFormat(styleDictionaryKnapsackFormat);

module.exports = {
  source: ['design-tokens/**/*.{json,js}'],
  platforms: {
    scss: {
      ...
    },
    js: {
      ...
    },
    knapsack: {
      transforms: ['attribute/cti', 'name/cti/kebab'],
      buildPath: './design-tokens/dist/',
      prefix: 'foo',
      files: [
        {
          destination: 'knapsack-design-tokens.json',
          format: 'knapsack',
        },
      ],
    },
  },
};
```

`knapsack.config.js`

```javascript
...

// Import the json created by running style dictionary with the Knapsack formatter
const designTokenData = require('./design-tokens/dist/knapsack-design-tokens');

// Assign your design token data to `config.designTokens.data`
const config = {
  patterns: ['./patterns/*'],
  newPatternDir: './patterns/',
  designTokens: {
    createCodeSnippet: token => `$${token.name}`,
    data: designTokenData,
  },
  dist: './dist',
  public: './public',
  data: './data',
  ... etc ...
};

module.exports = config;
```
