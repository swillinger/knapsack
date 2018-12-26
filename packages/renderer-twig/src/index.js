const BedrockRenderer = require('@basalt/bedrock-renderer-base');
const TwigRenderer = require('@basalt/twig-renderer');

class BedrockTwigRenderer extends BedrockRenderer {
  constructor(config) {
    super({
      id: 'twig',
      extension: '.twig',
    });
    this.twigRenderer = new TwigRenderer(config);
  }

  test(theTemplatePath) {
    return theTemplatePath.endsWith(this.extension);
  }

  async render({ template, data = {} }) {
    return this.twigRenderer.render(template.alias, data);
  }
}

module.exports = BedrockTwigRenderer;
