import fs from 'fs-extra';
import path from 'path';
import ManifestPlugin from 'webpack-manifest-plugin';
import { knapsackEvents, EVENTS, KnapsackEventsData } from './events';
import * as log from '../cli/log';
import { KnapsackRendererBase } from './renderer-base';
import {
  KnapsackTemplateRendererBase,
  KnapsackConfig,
} from '../schemas/knapsack-config';

export class KnapsackRendererWebpackBase extends KnapsackRendererBase
  implements KnapsackTemplateRendererBase {
  webpack: typeof import('webpack');

  webpackConfig: import('webpack').Configuration;

  webpackEntry: {};

  publicPath: string;

  language: string;

  restartWebpackWatch: () => void;

  webpackCompiler: import('webpack').Compiler;

  webpackManifest: {
    /**
     * Maps normal name to root relative output
     * i.e. `"card-react.js": "/knapsack-renderer-react/card-react.bundle.e5dc762abd3b4dfe5a96.js"`
     */
    [fileName: string]: string;
  };

  webpackWatcher: import('webpack').Compiler.Watching;

  constructor({
    id,
    extension,
    language,
    webpackConfig,
    webpack,
  }: {
    id: string;
    extension: string;
    language: string;
    webpackConfig: import('webpack').Configuration;
    webpack: typeof import('webpack');
  }) {
    super({
      id,
      extension,
      language,
    });
    this.webpack = webpack;
    this.webpackConfig = webpackConfig;
    this.webpackEntry = {};
  }

  createWebpackCompiler(entry: import('webpack').Entry) {
    const plugins = this.webpackConfig.plugins || [];
    const newWebpackConfig: import('webpack').Configuration = {
      ...this.webpackConfig,
      entry,
      mode:
        process.env.NODE_ENV === 'production' ? 'production' : 'development',
      externals: {
        react: 'React',
      },
      output: {
        filename: '[name].bundle.[hash].js',
        path: this.outputDir,
        publicPath: this.publicPath,
        chunkFilename: '[name].chunk.[hash].js',
        library: ['knapsack', '[name]'],
        libraryTarget: 'var',
      },
      optimization: {},
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
      this.logPrefix,
    );
    log.silly('', entry, this.logPrefix);
  }

  createWebpackEntryFromPatterns(
    patterns: import('@knapsack/app/src/server/patterns').Patterns,
  ) {
    const entry = {};
    patterns.getPatterns().forEach(pattern => {
      pattern.templates
        .filter(t => t.templateLanguageId === this.id)
        .forEach(template => {
          entry[
            `${pattern.id}-${template.id}`
          ] = patterns.getTemplateAbsolutePath({
            patternId: pattern.id,
            templateId: template.id,
          });

          const demos = Object.values(template?.demosById ?? {});
          if (demos) {
            demos
              .filter(KnapsackRendererWebpackBase.isTemplateDemo)
              .forEach(demo => {
                if (demo?.templateInfo?.path) {
                  entry[
                    `${pattern.id}-${template.id}-${demo.id}`
                  ] = patterns.getTemplateDemoAbsolutePath({
                    patternId: pattern.id,
                    templateId: template.id,
                    demoId: demo.id,
                  });
                }
              });
          }
        });
    });
    return entry;
  }

  async init(opt: {
    config: KnapsackConfig;
    patterns: import('@knapsack/app/src/server/patterns').Patterns;
    cacheDir: string;
  }): Promise<void> {
    await super.init(opt);
    this.publicPath = `/${path.relative(this.cacheDir, this.outputDir)}/`;
    this.webpackEntry = this.createWebpackEntryFromPatterns(opt.patterns);
    this.createWebpackCompiler(this.webpackEntry);

    knapsackEvents.on(
      EVENTS.PATTERNS_DATA_READY,
      (allPatterns: KnapsackEventsData['PATTERNS_DATA_READY']) => {
        const entry = this.createWebpackEntryFromPatterns(opt.patterns);
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
      },
    );
  }

  setManifest() {
    return fs
      .readFile(path.join(this.outputDir, 'manifest.json'), 'utf8')
      .then(manifestString => JSON.parse(manifestString))
      .then(manifest => {
        this.webpackManifest = manifest;
      })
      .catch(error => {
        log.error('setManifest()', error);
        throw new Error(
          `Error getting WebPack manifest.json file. ${error.message}`,
        );
      });
  }

  setManifestSync() {
    try {
      const manifestString = fs.readFileSync(
        path.join(this.outputDir, 'manifest.json'),
        'utf8',
      );
      const manifest = JSON.parse(manifestString);
      this.webpackManifest = manifest;
    } catch (error) {
      log.error('setManifest()', error);
      throw new Error(
        `Error getting WebPack manifest.json file. ${error.message}`,
      );
    }
  }

  getWebPackEntryPath(id: string, ext = '.js'): string {
    if (!this.webpackManifest) this.setManifestSync();
    if (!this.webpackManifest) {
      throw new Error(
        `Webpack has not been built yet, cannot access id "${id}"`,
      );
    }
    const entry = `${id}${ext}`;
    const result = this.webpackManifest[entry];
    if (!result) {
      const msg = `Could not find webpack entry "${entry}".`;
      console.error(`Possible ids: "${Object.keys(this.webpackManifest)}"`);
      throw new Error(msg);
    }
    return result;
  }

  build(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.webpackCompiler.run(async (err, stats) => {
        if (err || stats.hasErrors()) {
          log.error(stats.toString(), err, this.logPrefix);
          reject();
          return;
        }
        await this.setManifest();
        resolve();
      });
    });
  }

  webpackWatch(): import('webpack').Compiler.Watching {
    log.verbose('Starting Webpack watch...', null, this.logPrefix);

    const watchOptions: import('webpack').Compiler.WatchOptions = {};

    return this.webpackCompiler.watch(
      watchOptions,
      async (err: Error, stats: import('webpack').Stats) => {
        if (err || stats.hasErrors()) {
          log.error(stats.toString(), err, this.logPrefix);
          return;
        }
        await this.setManifest();
        log.info('Webpack recompiled', null, this.logPrefix);
        super.onChange({
          path: '',
        }); // @todo get path of file changed from `stats` and pass it in here
      },
    );
  }

  async watch({ templatePaths }) {
    await super.watch({ templatePaths });
    this.restartWebpackWatch = () => {
      log.verbose('Restarting Webpack Watch', null, this.logPrefix);
      this.webpackWatcher.close(() => {
        log.verbose('Restarted Webpack Watch', null, this.logPrefix);
        this.webpackWatcher = this.webpackWatch();
      });
    };
    this.webpackWatcher = this.webpackWatch();
  }

  // eslint-disable-next-line class-methods-use-this
  onChange() {
    // overwriting so we can call event after webpack compiles
  }
}
