const twigRenderer = require('./twig-renderer');

/** @type {BedrockConfig} */
const config = {
  src: ['./assets/patterns/*'], // @todo rename `src` to `patterns`
  newPatternDir: './assets/patterns/',
  examplesDir: './assets/examples/',
  dist: './dist',
  public: './public',
  data: './data', // @todo consider removing. needed? could see future use, but don't think there is any current use.
  assets: './assets',
  css: ['./public/assets/simple.css'],
  // js: ['./public/assets/script.js'],
  site: {
    title: 'A Super Simple Site',
    subtitle: 'A Simple Example of a Design System',
    slogan: "Wasn't that simple?",
    version: '1.2.3',
  },
  templates: [{
    test: theTemplatePath => theTemplatePath.endsWith('.twig'),
    // render: () => console.log('render..') //@todo
    render: (template, data = {}) => twigRenderer.render(template, data),
    renderString: (templateString, data = {}) => twigRenderer.renderString(templateString, data),
  }],
  designTokens: './design-tokens/tokens.yml',
};

module.exports = config;
