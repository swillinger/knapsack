const TwigRenderer = require('@basalt/twig-renderer');

/** @type {TwigRendererConfig} */
const config = {
  src: {
    roots: ['./assets/patterns'],
    namespaces: [
      {
        id: 'components',
        recursive: true,
        paths: ['./assets/patterns'],
      },
    ],
  },
};
const twigRenderer = new TwigRenderer(config);

module.exports = twigRenderer;
