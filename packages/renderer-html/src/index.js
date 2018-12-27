const { BedrockRendererBase } = require('@basalt/bedrock');
const fs = require('fs-extra');

class BedrockHtmlRenderer extends BedrockRendererBase {
  constructor() {
    super({
      id: 'html',
      extension: '.html',
    });
  }

  test(theTemplatePath) {
    return theTemplatePath.endsWith(this.extension);
  }

  async render({ template }) {
    try {
      return {
        ok: true,
        html: await fs.readFile(template.absolutePath, 'utf8'),
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message,
      };
    }
  }
}

module.exports = BedrockHtmlRenderer;
