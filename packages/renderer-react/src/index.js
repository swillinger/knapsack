const { bedrockEvents, EVENTS, log } = require('@basalt/bedrock');
const BedrockRenderer = require('@basalt/bedrock-renderer-base');
const fs = require('fs-extra');
const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const { copyReactAssets } = require('./utils');

class BedrockReactRenderer extends BedrockRenderer {
  constructor({ webpackConfig, webpack }) {
    super({
      id: 'react',
      extension: '.jsx',
    });
    this.webpack = webpack;
    this.webpackConfig = webpackConfig;
    this.webpackEntry = {};
  }

  test(theTemplatePath) {
    return theTemplatePath.endsWith(this.extension);
  }

  createWebpackCompiler(entry) {
    const plugins = this.webpackConfig.plugins || [];
    const newWebpackConfig = {
      ...this.webpackConfig,
      entry,
      mode:
        process.env.NODE_ENV === 'production' ? 'production' : 'development',
      externals: {
        react: 'React',
      },
      output: {
        filename: '[name].bundle.[hash].js',
        path: this.distDirAbsolute,
        publicPath: this.publicPath,
        chunkFilename: '[name].chunk.[hash].js',
        library: ['bedrock', '[name]'],
        libraryTarget: 'var',
      },
      // @todo implement code splitting
      // optimization: {
      //   minimize: process.env.NODE_ENV === 'production',
      //   runtimeChunk: 'single',
      //   splitChunks: {
      //     name: true,
      //     chunks: 'all',
      //     maxInitialRequests: 30,
      //     maxAsyncRequests: 50,
      //     maxSize: 300000,
      //   },
      // },
      plugins: [
        ...plugins,
        new ManifestPlugin({
          writeToFileEmit: true,
        }),
      ],
    };
    this.webpackCompiler = this.webpack(newWebpackConfig);
    log.verbose(
      'New Webpack Config and Compiler created',
      null,
      'templateRenderer:react',
    );
    log.silly('', entry, 'templateRenderer:react');
  }

  createWebpackEntryFromPatterns(patterns) {
    const entry = {};
    patterns.forEach(pattern => {
      pattern.templates
        .filter(t => this.test(t.absolutePath))
        .forEach(template => {
          entry[`${pattern.id}-${template.id}`] = template.absolutePath;
        });
    });
    return entry;
  }

  init({ config, allPatterns }) {
    /** @type {BedrockConfig} */
    this.config = config;
    this.distDirAbsolute = path.resolve(this.config.dist, this.outputDirName);
    this.publicPath = `/${path.relative(
      this.config.dist,
      this.distDirAbsolute,
    )}/`;
    this.assets = copyReactAssets(this.distDirAbsolute, this.publicPath);
    this.webpackEntry = this.createWebpackEntryFromPatterns(allPatterns);
    this.createWebpackCompiler(this.webpackEntry);

    bedrockEvents.on(EVENTS.PATTERNS_DATA_READY, patterns => {
      const entry = this.createWebpackEntryFromPatterns(patterns);
      if (
        Object.keys(this.webpackEntry)
          .sort()
          .toString() !==
        Object.keys(entry)
          .sort()
          .toString()
      ) {
        this.webpackEntry = entry;
        this.createWebpackCompiler(entry);
        if (this.restartWebpackWatch) {
          this.restartWebpackWatch();
        }
      }
    });
  }

  setManifest() {
    return fs
      .readFile(path.join(this.distDirAbsolute, 'manifest.json'), 'utf8')
      .then(manifestString => JSON.parse(manifestString))
      .then(manifest => {
        this.webpackManifest = manifest;
        return manifest;
      })
      .catch(console.log.bind(console));
  }

  build() {
    return new Promise((resolve, reject) => {
      this.webpackCompiler.run(async (err, stats) => {
        if (err || stats.hasErrors()) {
          log.error(stats.toString(), err, 'react');
          reject();
          return;
        }
        resolve();
      });
    });
  }

  webpackWatch() {
    log.verbose('Starting Webpack watch...', null, 'templateRenderer:react');
    return this.webpackCompiler.watch({}, (err, stats) => {
      if (err || stats.hasErrors()) {
        log.error(stats.toString(), err, 'react');
        return;
      }
      this.setManifest();
      log.info('Webpack recompiled', null, 'react');
      super.onChange({ path: '' });
    });
  }

  async watch({ config, templatePaths }) {
    await super.watch({ config, templatePaths });
    this.restartWebpackWatch = () => {
      log.verbose('Restarting Webpack Watch', null, 'templateRenderer:react');
      this.webpackWatcher.close(() => {
        log.verbose('Restarted Webpack Watch', null, 'templateRenderer:react');
        this.webpackWatcher = this.webpackWatch();
      });
    };
    this.webpackWatcher = this.webpackWatch();
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

  // eslint-disable-next-line class-methods-use-this
  onChange() {
    // overwriting so we can call event after webpack compiles
  }
}

module.exports = BedrockReactRenderer;
