const os = require('os');
const fs = require('fs-extra');
const { join } = require('path');
const globby = require('globby');
const {
  validateSchemaAndAssignDefaults,
} = require('@basalt/bedrock-schema-utils');
const chokidar = require('chokidar');
// const { FileDb } = require('../db');
const patternSchema = require('../../schemas/pattern.schema');
// const patternMetaSchema = require('./pattern-meta.schema');
const { writeAllFiles } = require('./pattern-templates');
// const { Pattern } = require('../../../schemas/dist/pattern-schema');
// const { Pattern } = require('../../../schemas/dist/pattern.schema');
// const { PatternMetaSchema as PatternMetaSchemaInterface } = require('../../../dist/schemas/pattern-meta');
const patternMetaSchema = require('../../schemas/pattern-meta.schema.json');
// const { PatternWithMetaSchema } = require('../../../dist/schemas/pattern-w-meta');

class BedrockPatternManifest {
  // config: BedrockPatternManifestConfig;

  // patternsDirs: string[];
  // allPatterns: PatternWithMetaSchema[];

  /**
   * @param {BedrockPatternManifestConfig} config - The config
   */
  constructor(config) {
    this.config = config;
    const { patternPaths } = config;
    /** @type {string[]} */
    this.patternsDirs = globby
      .sync(patternPaths, {
        expandDirectories: true,
        onlyFiles: false,
      })
      .filter(thePath => fs.statSync(thePath).isDirectory());

    // this.db = new FileDb({
    //   dbDir: config.dataDir,
    //   name: 'bedrock.patterns',
    //   defaults: {},
    // });

    this.getPatterns = this.getPatterns.bind(this);
    this.getPattern = this.getPattern.bind(this);
    this.getPatternMeta = this.getPatternMeta.bind(this);
    this.setPatternMeta = this.setPatternMeta.bind(this);
    this.createPatternFiles = this.createPatternFiles.bind(this);
    this.createPatternsData = this.createPatternsData.bind(this);
    this.updatePatternsData = this.updatePatternsData.bind(this);
    this.watch = this.watch.bind(this);

    /** @type {PatternWithMetaSchema[]} */
    this.allPatterns = this.createPatternsData();
  }

  /**
   * @returns {PatternWithMetaSchema[]}
   */
  createPatternsData() {
    const patterns = [];

    this.patternsDirs.forEach(dir => {
      // Clearing the `require()` cache so we can run this function many times
      // See https://nodejs.org/api/modules.html#modules_require_cache
      // @todo Only clear the `require()` cache for the files that have changed, instead of rebuilding the whole thing if a single file changes. Though it'll be hard in the case of nested Patterns.
      Object.keys(require.cache)
        .filter(cachedPath => cachedPath.startsWith(dir))
        .forEach(cachedPath => delete require.cache[cachedPath]);
      try {
        /** @type {PatternWithMetaSchema} */
        const pattern = require(dir); // eslint-disable-line
        if (pattern) {
          const results = validateSchemaAndAssignDefaults(
            patternSchema,
            pattern,
          );
          if (!results.ok) {
            const name = dir.split('/').pop();
            console.log();
            console.error(
              `Error! Pattern Schema validation failed for "${name}"`,
              results.message,
            );
            console.error(
              'Review the "index.js" in that folder and compare to "pattern.schema.json"',
            );
            console.log();
            process.exit(1);
          }

          const metaFilePath = join(dir, pattern.metaFilePath);
          // eslint-disable-next-line
          const patternMeta = require(metaFilePath);
          const metaResults = validateSchemaAndAssignDefaults(
            patternMetaSchema,
            patternMeta,
          );
          if (!metaResults.ok) {
            const name = dir.split('/').pop();
            console.log();
            console.error(
              `Error! Pattern Schema validation failed for "${name}"`,
              results.message,
            );
            console.error(
              `Review the "${
                pattern.metaFilePath
              }" in that folder and compare to "pattern.schema.json"`,
              metaFilePath,
            );
            console.log();
            process.exit(1);
          }
          /** @type {PatternWithMetaSchema} */
          const patternWithMeta = {
            ...results.data,
            metaFilePath, // replaces original relative one with absolute path
            meta: metaResults.data,
          };

          patterns.push(patternWithMeta);
        }
      } catch (e) {
        // if it failed it's b/c it didn't have a `index.js` to grab; that's ok
      }
    });

    return patterns;
  }

  updatePatternsData() {
    this.allPatterns = this.createPatternsData();
  }

  /**
   * @param {string} id
   * @returns {PatternWithMetaSchema}
   */
  getPattern(id) {
    return this.allPatterns.find(p => p.id === id);
  }

  /**
   * @returns {PatternWithMetaSchema[]}
   */
  getPatterns() {
    return this.allPatterns;
  }

  /**
   * @param {string} id
   * @returns {PatternMetaSchema}
   */
  getPatternMeta(id) {
    const pattern = this.getPattern(id);

    return pattern.meta;
  }

  /**
   * @param {string} id
   * @param {PatternMetaSchema} meta
   * @returns {Promise<GenericResponse>}
   */
  async setPatternMeta(id, meta) {
    const pattern = this.getPattern(id);
    try {
      await fs.writeFile(
        pattern.metaFilePath,
        JSON.stringify(meta, null, '  ') + os.EOL,
      );
      // this.db.set(`${id}.meta`, meta);
      return {
        ok: true,
        message: `Pattern Meta for ${id} saved successfully`,
        data: {},
      };
    } catch (error) {
      return {
        ok: false,
        message: error.toString(),
        data: {},
      };
    }
  }

  async createPatternFiles(config) {
    const dir = join(this.config.newPatternDir, config.id);
    const exists = await fs.pathExists(dir);
    if (exists) {
      return {
        ok: false,
        message: `That directory already exists, not overwriting it. ${dir}`,
        data: {},
      };
    }
    await fs.ensureDir(dir);

    await writeAllFiles(dir, config);

    this.patternsDirs.push(dir);
    this.updatePatternsData();

    return {
      ok: true,
      message: `Created Pattern File in "${dir}"`,
      data: {},
    };
  }

  watch(cb) {
    const watcher = chokidar.watch(this.patternsDirs.map(d => join(d, '**')), {
      ignoreInitial: true,
      cwd: __dirname,
      ignored: ['**/node_modules/**', '*.scss'],
    });

    watcher.on('all', (event, path) => {
      this.updatePatternsData();
      cb({ event, path });
    });
  }
}

module.exports = BedrockPatternManifest;
