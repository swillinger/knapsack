```
npm install @basalt/bedrock-renderer-twig --save
```

## Usage

In `bedrock.config.js`:

The config passed into `new TwigRenderer()` is passed directly to [`@basalt/twig-renderer`](https://github.com/basaltinc/twig-renderer), see there for config details.

```js
const HtmlRenderer = require('@basalt/bedrock-renderer-html');

const config = {
  // rest of config here
  templates: [
    new TwigRenderer({
      src: {
        roots: ['./assets/patterns'],
        namespaces: [{
          id: 'components',
          recursive: true,
          paths: ['./assets/patterns'],
        }],
      }
    }),
  ],
};

module.exports = config;
```
