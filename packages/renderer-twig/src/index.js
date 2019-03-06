const { BedrockRendererBase } = require('@basalt/bedrock');
const TwigRenderer = require('@basalt/twig-renderer');

/* eslint-disable class-methods-use-this */

class BedrockTwigRenderer extends BedrockRendererBase {
  constructor(config) {
    super({
      id: 'twig',
      extension: '.twig',
      language: 'twig',
    });
    this.twigRenderer = new TwigRenderer({
      keepAlive: process.env.NODE_ENV === 'production',
      ...config,
    });
  }

  async render({ template, data = {} }) {
    return this.twigRenderer.render(template.alias, data);
  }

  async getUsage({ template, data = {} }) {
    const { alias } = template;
    return `
{% include "${alias}" with ${JSON.stringify(data, null, '  ')} only %}
    `.trim();
  }
}

module.exports = BedrockTwigRenderer;
