---
id: version-0.40.2-config
title: Configuration
original_id: config
---

### `knapsack.config.js`

This is the main config file. 

```js
const config = {
  patterns: [ './assets/patterns/*' ],
  docsDir: './docs',
  designTokens: './design-tokens/tokens.yml',
  dist: './dist',
  public: './public',
  data: './data',
  css: [ './public/assets/simple.css' ],
  js: ['./public/assets/script.js'],
};

module.exports = config;
```
