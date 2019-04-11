```
npm install @knapsack/renderer-react --save
```

## Usage

In `knapsack.config.js`:

```js
const ReactRenderer = require('@knapsack/renderer-react');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

/** @type {KnapsackUserConfig} */
const config = {
  // rest of config ...
  templateRenderers: [
    new ReactRenderer({
      webpackConfig,
      webpack,
    }),
  ],
};

module.exports = config;
```
