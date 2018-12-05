const twigRenderer = require('./twig-renderer');

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
  templates: [
    {
      test: theTemplatePath => theTemplatePath.endsWith('.twig'),
      render: (template, data = {}) => twigRenderer.render(template, data),
      renderString: (templateString, data = {}) =>
        twigRenderer.renderString(templateString, data),
    },
  ],
};

module.exports = config;
