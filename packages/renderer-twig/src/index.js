const { BedrockRendererBase } = require('@basalt/bedrock');
const TwigRenderer = require('@basalt/twig-renderer');

class BedrockTwigRenderer extends BedrockRendererBase {
  constructor(config) {
    super({
      id: 'twig',
      extension: '.twig',
    });
    this.twigRenderer = new TwigRenderer({
      keepAlive: process.env.NODE_ENV === 'production',
      ...config,
    });
  }

  test(theTemplatePath) {
    return theTemplatePath.endsWith(this.extension);
  }

  async render({ template, data = {} }) {
    return this.twigRenderer.render(template.alias, data);
  }
}

module.exports = BedrockTwigRenderer;
