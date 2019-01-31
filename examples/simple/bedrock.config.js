const HtmlRenderer = require('@basalt/bedrock-renderer-html');
const TwigRenderer = require('@basalt/bedrock-renderer-twig');
const { version } = require('./package.json');

/** @type {BedrockConfig} */
const config = {
  patterns: ['./assets/patterns/*', './assets/pages/*'],
  newPatternDir: './assets/patterns/',
  designTokens: './design-tokens/tokens.yml',
  dist: './dist',
  public: './public',
  data: './data',
  css: ['./public/assets/simple.css'],
  // js: ['./public/assets/script.js'],
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
      }
    }),
  ],
};

module.exports = config;
