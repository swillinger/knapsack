---
id: config
title: Configuration
---

### `knapsack.config.js`

This is the main config file. 

```js
const HtmlRenderer = require('@basalt/knapsack-renderer-html');
const TwigRenderer = require('@basalt/knapsack-renderer-twig');
const { theoKnapsackFormat } = require('@basalt/knapsack');
const theo = require('theo');
const { version } = require('./package.json');

const format = theoKnapsackFormat(theo);

/** @type {KnapsackUserConfig} */
const config = {
  patterns: ['./assets/patterns/*', './assets/pages/*'],
  newPatternDir: './assets/patterns/',
  designTokens: {
    createCodeSnippet: token => `$${token.name}`,
    data: theo.convertSync({
      transform: {
        type: 'web',
        file: './design-tokens/tokens.yml',
      },
      format,
    }),
  },
  dist: './dist',
  public: './public',
  data: './data',
  assetSets: [
    {
      id: 'default',
      title: 'Default',
      assets: [
        {
          src: './public/assets/simple.css',
        },
      ],
    },
  ],
  changelog: './CHANGELOG.md',
  version,
  docsDir: './docs',
  templateRenderers: [
    new HtmlRenderer(),
    new TwigRenderer({
      src: {
        roots: ['./assets/patterns'],
        namespaces: [
          {
            id: 'components',
            recursive: true,
            paths: ['./assets/patterns'],
          },
          {
            id: 'pages',
            recursive: true,
            paths: ['./assets/pages'],
          },
        ],
      },
    }),
  ],
};

module.exports = config;
```
