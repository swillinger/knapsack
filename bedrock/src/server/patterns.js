const { gql } = require('apollo-server-express');
const os = require('os');
const fs = require('fs-extra');
const { join } = require('path');
const globby = require('globby');
const {
  validateSchemaAndAssignDefaults,
} = require('@basalt/bedrock-schema-utils');
const chokidar = require('chokidar');
// const { FileDb } = require('./db');
const patternSchema = require('../schemas/pattern.schema');
const patternMetaSchema = require('../schemas/pattern-meta.schema.json');
const { writeJson } = require('./server-utils');

const patternsTypeDef = gql`
  type PatternDoAndDontItem {
    image: String!
    caption: String
    do: Boolean!
  }

  "Visual representations of what to do, and not to do, with components."
  type PatternDoAndDont {
    title: String
    description: String
    items: [PatternDoAndDontItem!]!
  }

  type PatternTemplate {
    name: String!
    "JSON Schema"
    schema: JSON
    "CSS Selector"
    selector: String
    uiSchema: JSON
    isInline: Boolean
  }

  enum PatternType {
    component
    layout
  }

  enum PatternStatus {
    draft
    inProgress
    ready
  }

  enum PatternUses {
    inSlice
    inGrid
    inComponent
  }

  enum PatternDemoSize {
    s
    m
    l
    full
  }

  type PatternMeta {
    title: String!
    description: String
    type: PatternType
    status: PatternStatus
    uses: [PatternUses]
    demoSize: PatternDemoSize
    hasIcon: Boolean
    dosAndDonts: [PatternDoAndDont]
  }

  type Pattern {
    id: ID!
    "Relative path to a JSON file that stores meta data for pattern. Schema for that file is in pattern-meta.schema.json."
    metaFilePath: String
    templates: [PatternTemplate]!
    meta: PatternMeta
  }

  type Query {
    patterns: [Pattern]
    pattern(id: ID): Pattern
  }
`;

/**
 * @param {string} dir,
 * @param {Object} config - @todo document
 * @returns {Promise<void>}
 */
async function writeMeta(dir, config) {
  const thePath = join(dir, 'meta.json');
  const theFile = {
    title: config.title,
  };
  await writeJson(thePath, theFile);
}

/**
 * @param {string} dir
 * @param {Object} config
 * @return {Promise<void>}
 */
async function writeEntry(dir, config) {
  const thePath = join(dir, 'index.js');
  const theFile = `
const schema = require('./${config.id}.schema.json');

module.exports = {
  id: '${config.id}',
  metaFilePath: './meta.json',
  templates: [
    {
      name: '@components/${config.id}.twig',
      selector: '.${config.id}',
      schema,
    },
  ],
};
`.trim();
  await fs.writeFile(thePath, theFile);
}

/**
 * @param {string} dir
 * @param {Object} config - @todo document
 * @returns {Promise<void>}
 */
async function writeSchema(dir, config) {
  const thePath = join(dir, `${config.id}.schema.json`);
  const theFile = {
    $schema: 'http://json-schema.org/draft-07/schema',
    title: config.title,
    type: 'object',
    description: '',
    additionalProperties: false,
    required: ['title'],
    properties: {
      title: {
        type: 'string',
        title: 'The Title',
      },
    },
    examples: [
      {
        title: 'Welcome to your new Pattern!',
      },
    ],
  };
  await writeJson(thePath, theFile);
}

/**
 * @param {string} dir
 * @param {Object} config
 * @returns {Promise<void>}
 */
async function writeTemplate(dir, config) {
  const thePath = join(dir, `${config.id}.twig`);
  const theFile = `
{% set classes = [
  '${config.id}',
] %}

<div class="{{ classes|join(' ') }}">
  <h4 class="${config.id}__title">{{ title }}</h4>
</div>
  `.trim();

  await fs.writeFile(thePath, theFile);
}

/**
 * @param {string} dir - The directory to write to
 * @param {Object} config - @todo document
 * @returns {Promise<void[]>}
 */
async function writeAllFiles(dir, config) {
  return Promise.all([
    writeMeta(dir, config),
    writeEntry(dir, config),
    writeSchema(dir, config),
    writeTemplate(dir, config),
  ]);
}

/**
 * @param {string[]} patternsDirs
 * @returns {PatternWithMetaSchema[]}
 */
function createPatternsData(patternsDirs) {
  const patterns = [];

  patternsDirs.forEach(dir => {
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
        const results = validateSchemaAndAssignDefaults(patternSchema, pattern);
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

/**
 * @param {string[]} patternPaths
 * @return {string[]}
 */
function getPatternsDirs(patternPaths) {
  return globby
    .sync(patternPaths, {
      expandDirectories: true,
      onlyFiles: false,
    })
    .filter(thePath => fs.statSync(thePath).isDirectory());
}

class Patterns {
  /**
   * @param {Object} opt
   * @param {string} opt.newPatternDir
   * @param {string[]} opt.patternPaths
   * @param {string} opt.dataDir
   */
  constructor({ newPatternDir, patternPaths, dataDir }) {
    /** @type {string} */
    this.newPatternDir = newPatternDir;
    /** @type {string[]} */
    this.patternPaths = patternPaths;
    /** @type {string} */
    this.dataDir = dataDir;

    /** @type {string[]} */
    this.patternsDirs = getPatternsDirs(this.patternPaths);

    /** @type {PatternWithMetaSchema[]} */
    this.allPatterns = createPatternsData(this.patternsDirs);
  }

  updatePatternsData() {
    this.patternsDirs = getPatternsDirs(this.patternPaths);
    this.allPatterns = createPatternsData(this.patternsDirs);
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
    const dir = join(this.newPatternDir, config.id);
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

const patternsResolvers = {
  Query: {
    patterns: (parent, args, { patterns }) => patterns.getPatterns(),
    pattern: (parent, { id }, { patterns }) => patterns.getPattern(id),
  },
};

module.exports = {
  Patterns,
  patternsResolvers,
  patternsTypeDef,
};
