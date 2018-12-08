const twigRenderer = require('./twig-renderer');

/** @type {BedrockConfig} */
const config = {
  patterns: ['./assets/patterns/*'],
  newPatternDir: './assets/patterns/',
  dist: './dist',
  public: './public',
  data: './data',
  css: ['./public/assets/simple.css'],
  // js: ['./public/assets/script.js'],
  templates: [{
    test: theTemplatePath => theTemplatePath.endsWith('.twig'),
    render: (template, data = {}) => twigRenderer.render(template, data),
    renderString: (templateString, data = {}) => twigRenderer.renderString(templateString, data),
  }],
  designTokens: './design-tokens/tokens.yml',
};

module.exports = config;
