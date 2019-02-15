const HtmlRenderer = require('@basalt/bedrock-renderer-html');
const TwigRenderer = require('@basalt/bedrock-renderer-twig');

/** @type {BedrockConfig} */
const config = {
  // patterns: ['./assets/patterns/*', './assets/pages/*'], @todo create full page examples
  patterns: ['./assets/patterns/*'],
  newPatternDir: './assets/patterns/',
  designTokens: './design-tokens/tokens.yml',
  dist: './dist',
  public: './public',
  data: './data',
  css: ['./public/css/bootstrap.css'],
  js: ['./public/js/bootstrap.bundle.js'],
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
