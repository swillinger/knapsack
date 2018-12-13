const BedrockRenderer = require('@basalt/bedrock-renderer-base');
const TwigRenderer = require('@basalt/twig-renderer');

class BedrockTwigRenderer extends BedrockRenderer {
  constructor(config) {
    super();
    this.id = 'twig';
    this.extension = '.twig';
    this.twigRenderer = new TwigRenderer(config);
  }

  test(theTemplatePath) {
    return theTemplatePath.endsWith(this.extension);
  }

  async render(templatePath, data = {}) {
    return this.twigRenderer.render(templatePath, data);
  }
}

module.exports = BedrockTwigRenderer;
