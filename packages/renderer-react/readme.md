```
npm install @basalt/bedrock-renderer-react --save
```

## Usage

In `bedrock.config.js`:

```js
const ReactRenderer = require('@basalt/bedrock-renderer-react');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

/** @type {BedrockUserConfig} */
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
