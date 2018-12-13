const BedrockRenderer = require('@basalt/bedrock-renderer-base');
const fs = require('fs-extra');

class BedrockHtmlRenderer extends BedrockRenderer {
  constructor() {
    super();
    this.id = 'html';
    this.extension = '.html';
  }

  test(theTemplatePath) {
    return theTemplatePath.endsWith(this.extension);
  }

  async render(templatePath) {
    try {
      return {
        ok: true,
        html: await fs.readFile(templatePath, 'utf8'),
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
