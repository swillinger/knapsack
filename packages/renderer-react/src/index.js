const { BedrockRendererWebpackBase } = require('@basalt/bedrock');
const { copyReactAssets } = require('./utils');

class BedrockReactRenderer extends BedrockRendererWebpackBase {
  constructor({ webpackConfig, webpack }) {
    super({
      id: 'react',
      extension: '.jsx',
      webpackConfig,
      webpack,
    });
    /** @type {string[]} */
    this.assets = [];
  }

  init({ config, allPatterns }) {
    super.init({ config, allPatterns });
    this.assets = copyReactAssets(this.distDirAbsolute, this.publicPath);
  }

  async render({ pattern, template, data }) {
    if (!this.webpackManifest) await this.setManifest();
    const id = `${pattern.id}-${template.id}`;
    const html = `
${this.assets.map(asset => `<script src="${asset}"></script>`).join('')}
<script src="${this.webpackManifest[`${id}.js`]}"></script>
<div data-dev-note="Bedrock React Template Wrapper" data-id="${id}"></div>
<script>
// Selects the div right before this script tag
const root = document.currentScript.previousElementSibling;
document.addEventListener('DOMContentLoaded', () => {
  const Component = window.bedrock['${id}'].default;
  ReactDOM.render(
    React.createElement(
      Component, 
      ${JSON.stringify(data)}
    ),
  root);
});
</script>
    `;

    return {
      ok: true,
      html,
    };
  }
}

module.exports = BedrockReactRenderer;
