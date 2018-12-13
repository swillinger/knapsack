const HtmlRenderer = require('@basalt/bedrock-renderer-html');
const TwigRenderer = require('@basalt/bedrock-renderer-twig');

/** @type {BedrockConfig} */
const config = {
  patterns: ['./assets/patterns/*'],
  newPatternDir: './assets/patterns/',
  designTokens: './design-tokens/tokens.yml',
  dist: './dist',
  public: './public',
  data: './data',
  css: ['./public/assets/simple.css'],
  // js: ['./public/assets/script.js'],
  docsDir: './docs',
  templates: [
    new HtmlRenderer(),
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
