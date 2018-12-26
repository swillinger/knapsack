/**
 *  Copyright (C) 2018 Basalt
    This file is part of Bedrock.
    Bedrock is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Bedrock is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Bedrock; if not, see <https://www.gnu.org/licenses>.
 */
const { gql } = require('apollo-server-express');
const GraphQLJSON = require('graphql-type-json');
const fs = require('fs-extra');
const { join, relative } = require('path');
const globby = require('globby');
const {
  validateSchemaAndAssignDefaults,
  validateUniqueIdsInArray,
} = require('@basalt/bedrock-schema-utils');
const chokidar = require('chokidar');
const {
  version: iframeResizerVersion,
} = require('iframe-resizer/package.json');
const { bedrockEvents, EVENTS } = require('./events');
// const { FileDb } = require('./db');
const patternSchema = require('../schemas/pattern.schema');
const patternMetaSchema = require('../schemas/pattern-meta.schema');
const {
  writeJson,
  findReadmeInDirSync,
  fileExists,
} = require('./server-utils');
const log = require('../cli/log');
const { FILE_NAMES } = require('../lib/constants');

const patternsTypeDef = gql`
  scalar JSON

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
    "JSON Schema"
    schema: JSON
    "CSS Selector"
    selector: String
    id: ID!
    path: String!
    title: String!
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
    readme: String
  }

  type PatternRenderResponse {
    ok: Boolean!
    html: String
    message: String
  }

  type Query {
    patterns: [Pattern]
    pattern(id: ID): Pattern
    render(
      patternId: ID
      templateId: ID
      wrapHtml: Boolean
      data: JSON
    ): PatternRenderResponse
  }

  type Mutation {
    setPatternMeta(id: ID, meta: JSON): JSON
    setPatternReadme(id: ID, readme: String): String
  }
`;

/**
 * @param {string} dir,
 * @param {Object} config - @todo document
 * @returns {Promise<void>}
 */
async function writeMeta(dir, config) {
  const thePath = join(dir, FILE_NAMES.PATTERN_META);
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
  const thePath = join(dir, FILE_NAMES.PATTERN_CONFIG);
  const theFile = `
const schema = require('./${config.id}.schema.json');

module.exports = {
  id: '${config.id}',
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
 * @param {BedrockTemplateRenderer[]} templateRenderers
 * @returns {BedrockPattern[]}
 */
function createPatternsData(patternsDirs, templateRenderers) {
  const patterns = [];

  patternsDirs.forEach(dir => {
    // Clearing the `require()` cache so we can run this function many times
    // See https://nodejs.org/api/modules.html#modules_require_cache
    // @todo Only clear the `require()` cache for the files that have changed, instead of rebuilding the whole thing if a single file changes. Though it'll be hard in the case of nested Patterns.
    Object.keys(require.cache)
      .filter(cachedPath => cachedPath.startsWith(dir))
      .forEach(cachedPath => delete require.cache[cachedPath]);
    try {
      const patternConfigPath = join(dir, FILE_NAMES.PATTERN_CONFIG);
      /** @type {PatternWithMetaSchema} */
      const pattern = require(patternConfigPath); // eslint-disable-line
      if (pattern) {
        const results = validateSchemaAndAssignDefaults(patternSchema, pattern);
        if (!results.ok) {
          const name = dir.split('/').pop();
          console.log();
          console.error(
            `Error! Pattern Schema validation failed for "${name}"`,
            results.message,
          );
          // @todo show user better error messages like what fields are wrong
          console.error(
            `Review the "${
              FILE_NAMES.PATTERN_CONFIG
            }" in that folder and compare to "pattern.schema.json"`,
          );
          console.log();
          process.exit(1);
        }

        const templateValidation = validateUniqueIdsInArray(
          results.data.templates,
        );
        if (!templateValidation.ok) {
          log.error(
            `Each "template" must have a unique "id", in "${relative(
              process.cwd(),
              dir,
            )}" these do not: ${templateValidation.duplicateIdList}`,
            null,
            'patterns',
          );
          process.exit(1);
        }

        results.data.templates = results.data.templates.map(template => {
          const templatePath = join(dir, template.path);
          if (!fileExists(templatePath)) {
            log.error(
              `Pattern ${pattern.id} has a template (${
                template.id
              }) with a path that cannot be found: ${templatePath}`,
            );
            process.exit(1);
          }

          // ensure we have a templateRenderer for this template
          if (templateRenderers.findIndex(t => t.test(templatePath)) === -1) {
            log.error(
              `Pattern ${pattern.id} has a template ${
                template.id
              } with no associated renderer.`,
            );
            process.exit(1);
          }

          return {
            ...template,
            absolutePath: templatePath,
          };
        });

        const metaFilePath = join(dir, FILE_NAMES.PATTERN_META);
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

        const readmeFilePath = findReadmeInDirSync(dir);
        let readme = '';
        if (readmeFilePath) {
          readme = fs.readFileSync(readmeFilePath, 'utf8');
        }

        /** @type {PatternWithMetaSchema} */
        const patternWithMeta = {
          ...results.data,
          dir,
          metaFilePath, // replaces original relative one with absolute path
          meta: metaResults.data,
          readme,
        };

        patterns.push(patternWithMeta);
      }
    } catch (e) {
      log.error('Problem loading up Patterns', e);
      process.exit(1);
    }
  }); // end building up `patterns`

  const results = validateUniqueIdsInArray(patterns);
  if (!results.ok) {
    log.error(
      `Each "bedrock.pattern.js" must have a unique "id", these do not: ${
        results.duplicateIdList
      }`,
      null,
      'patterns',
    );
    process.exit(1);
  }
  bedrockEvents.emit(EVENTS.PATTERNS_DATA_READY, patterns);
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
    .filter(
      thePath =>
        fs.statSync(thePath).isDirectory() &&
        fs.existsSync(join(thePath, FILE_NAMES.PATTERN_CONFIG)),
    );
}

class Patterns {
  /**
   * @param {Object} opt
   * @param {string} opt.newPatternDir
   * @param {string[]} opt.patternPaths
   * @param {string} opt.dataDir
   * @param {string[]} opt.rootRelativeJs
   * @param {string[]} opt.rootRelativeCSS
   * @param {BedrockTemplateRenderer[]} opt.templateRenderers
   */
  constructor({
    newPatternDir,
    patternPaths,
    dataDir,
    templateRenderers,
    rootRelativeJs,
    rootRelativeCSS,
  }) {
    /** @type {string} */
    this.newPatternDir = newPatternDir;
    /** @type {string[]} */
    this.patternPaths = patternPaths;
    /** @type {string} */
    this.dataDir = dataDir;

    this.templateRenderers = templateRenderers;
    /** @type {string[]} */
    this.rootRelativeCSS = rootRelativeCSS;
    /** @type {string[]} */
    this.rootRelativeJs = rootRelativeJs;

    /** @type {string[]} */
    this.patternsDirs = getPatternsDirs(this.patternPaths);

    /** @type {BedrockPattern[]} */
    this.allPatterns = createPatternsData(
      this.patternsDirs,
      this.templateRenderers,
    );
  }

  updatePatternsData() {
    this.patternsDirs = getPatternsDirs(this.patternPaths);
    this.allPatterns = createPatternsData(
      this.patternsDirs,
      this.templateRenderers,
    );
  }

  /**
   * @param {string} id
   * @returns {BedrockPattern}
   */
  getPattern(id) {
    return this.allPatterns.find(p => p.id === id);
  }

  /**
   * @returns {BedrockPattern[]}
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
      await writeJson(pattern.metaFilePath, meta);
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

  /**
   * Get all the pattern's template file paths
   * @return {string[]} - Absolute paths to all template files
   */
  getAllTemplatePaths() {
    const allTemplatePaths = [];
    this.allPatterns.forEach(pattern => {
      pattern.templates.forEach(template => {
        allTemplatePaths.push(template.absolutePath);
      });
    });
    return allTemplatePaths;
  }

  /**
   * @param {string} id
   * @param {string} readme
   * @returns {Promise<void>}
   */
  async setPatternReadme(id, readme) {
    const pattern = this.getPattern(id);
    await fs.writeFile(findReadmeInDirSync(pattern.dir), readme);
  }

  /**
   * @param {string} id
   * @returns {Promise<string>}
   */
  async getPatternReadme(id) {
    const pattern = this.getPattern(id);
    return fs.readFile(findReadmeInDirSync(pattern.dir), 'utf8');
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

  watch() {
    const configFilesToWatch = [];
    this.allPatterns.forEach(pattern => {
      configFilesToWatch.push(
        join(pattern.dir, FILE_NAMES.PATTERN_CONFIG),
        join(pattern.dir, FILE_NAMES.PATTERN_META),
      );
    });
    const watcher = chokidar.watch(configFilesToWatch, {
      ignoreInitial: true,
    });

    watcher.on('ready', () => {
      log.silly(
        `Core Patterns is watching these files:`,
        watcher.getWatched(),
        'patterns',
      );
    });

    watcher.on('all', (event, path) => {
      bedrockEvents.emit(EVENTS.PATTERN_CONFIG_CHANGED, { event, path });
      this.updatePatternsData();
    });
  }

  /**
   * Render template
   * @param {Object} opt
   * @param {string} opt.patternId - Pattern Id
   * @param {string} [opt.templateId] - Template Id
   * @param {boolean} [opt.wrapHtml=true] - Should it wrap HTML results with `<head>` and include assets?
   * @param {Object} [opt.data] - Data to pass to template
   * @return {Promise<BedrockTemplateRenderResults>}
   */
  async render({ patternId, templateId = '', wrapHtml = true, data = {} }) {
    const pattern = this.getPattern(patternId);
    let [template] = pattern.templates;
    if (templateId) {
      template = pattern.templates.find(t => t.id === templateId);
    }

    const renderer = this.templateRenderers.find(t =>
      t.test(template.absolutePath),
    );

    const renderedTemplate = await renderer.render({
      pattern,
      template,
      data,
    });

    if (!renderedTemplate.ok) return renderedTemplate;
    if (wrapHtml) {
      const wrappedHtml = renderer.wrapHtml({
        html: renderedTemplate.html,
        headJsUrls: [
          `https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/${iframeResizerVersion}/iframeResizer.contentWindow.min.js`,
        ],
        cssUrls: this.rootRelativeCSS,
        jsUrls: this.rootRelativeJs,
      });
      return {
        ...renderedTemplate,
        html: wrappedHtml,
      };
    }
    return renderedTemplate;
  }
}

const patternsResolvers = {
  Query: {
    patterns: (parent, args, { patterns }) => patterns.getPatterns(),
    pattern: (parent, { id }, { patterns }) => patterns.getPattern(id),
    render: async (
      parent,
      { patternId, templateId, wrapHtml, data },
      { patterns },
    ) => patterns.render({ patternId, templateId, wrapHtml, data }),
  },
  Mutation: {
    setPatternMeta: async (parent, { id, meta }, { patterns, canWrite }) => {
      if (!canWrite) return false;
      await patterns.setPatternMeta(id, meta);
      return patterns.getPatternMeta(id);
    },
    setPatternReadme: async (
      parent,
      { id, readme },
      { patterns, canWrite },
    ) => {
      if (!canWrite) return false;
      await patterns.setPatternReadme(id, readme);
      return patterns.getPatternReadme(id);
    },
  },
  JSON: GraphQLJSON,
};

module.exports = {
  Patterns,
  patternsResolvers,
  patternsTypeDef,
};
