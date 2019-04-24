const { KnapsackRendererBase } = require('@basalt/knapsack');
const fs = require('fs-extra');

/* eslint-disable class-methods-use-this */

class KnapsackHtmlRenderer extends KnapsackRendererBase {
  constructor() {
    super({
      id: 'html',
      extension: '.html',
    });
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

  async getUsage({ template }) {
    return fs.readFile(template.absolutePath, 'utf8');
  }
}

module.exports = KnapsackHtmlRenderer;
