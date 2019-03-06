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
const { join, relative, resolve, parse } = require('path');
const globby = require('globby');
const { getFileSizes } = require('get-file-sizes');
const {
  validateSchemaAndAssignDefaults,
  validateUniqueIdsInArray,
} = require('@basalt/bedrock-schema-utils');
const chokidar = require('chokidar');
const {
  version: iframeResizerVersion,
} = require('iframe-resizer/package.json');
const qs = require('qs');
const { bedrockEvents, EVENTS } = require('./events');
const { FileDb } = require('./db');
const patternSchema = require('../schemas/pattern.schema');
const patternMetaSchema = require('../schemas/pattern-meta.schema');
const { writeJson, fileExists, fileExistsOrExit } = require('./server-utils');
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

  type PatternAsset {
    src: String!
    publicPath: String!
    sizeRaw: String
    sizeKb: String
  }

  type PatternAssetSet {
    id: ID!
    title: String!
    assets: [PatternAsset]
  }

  type PatternTemplate {
    "JSON Schema"
    schema: JSON
    "CSS Selector"
    selector: String
    id: ID!
    path: String!
    title: String!
    docPath: String
    doc: String
    demoDatas: [JSON]
    demoUrls: [String]
    uiSchema: JSON
    isInline: Boolean
    demoSize: String
    assetSets: [PatternAssetSet]
    hideCodeBlock: Boolean
  }

  type PatternType {
    id: ID!
    title: String!
    patterns: [Pattern]
  }

  type PatternStatus {
    id: ID!
    title: String!
    color: String
  }

  type PatternSettings {
    patternStatuses: [PatternStatus]
    patternTypes: [PatternType]
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
    type: ID
    status: String
    uses: [PatternUses]
    hasIcon: Boolean
    dosAndDonts: [PatternDoAndDont]
    demoSize: PatternDemoSize
    showAllTemplates: Boolean
  }

  type Pattern {
    id: ID!
    "Relative path to a JSON file that stores meta data for pattern. Schema for that file is in pattern-meta.schema.json."
    metaFilePath: String
    templates: [PatternTemplate]!
    meta: PatternMeta
  }

  type PatternRenderResponse {
    ok: Boolean!
    html: String
    message: String
  }

  type TemplateCode {
    usage: String
    data: JSON
    templateSrc: String
    html: String
    language: String
  }

  type Query {
    patterns: [Pattern]
    pattern(id: ID): Pattern
    templateCode(
      patternId: String
      templateId: String
      data: JSON
    ): TemplateCode
    patternTypes: [PatternType]
    patternType(id: ID): PatternType
    patternStatuses: [PatternStatus]
    patternSettings: PatternSettings
    render(
      patternId: ID
      templateId: ID
      wrapHtml: Boolean
      data: JSON
    ): PatternRenderResponse
  }

  type Mutation {
    setPatternMeta(id: ID, meta: JSON): JSON
    setPatternTypes(patternTypes: JSON): [PatternType]
    setPatternStatuses(patternStatuses: JSON): [PatternStatus]
    setPatternSettings(settings: JSON): PatternSettings
    setPatternTemplateReadme(id: ID, templateId: ID, readme: String): Pattern
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
 * @param {string} url
 * @return {boolean}
 */
function isRemoteUrl(url) {
  return url.startsWith('http') || url.startsWith('//');
}

/**
 * @param {Object} opt
 * @param {BedrockAssetSetUserConfig[]} opt.assetSets
 * @param {string} opt.publicDir
 * @param {string} opt.configPathBase
 * @return {BedrockAssetSet[]}
 */
function processAssetSets({ assetSets, publicDir, configPathBase }) {
  return assetSets.map(assetSet => ({
    ...assetSet,
    assets: assetSet.assets.map(asset => {
      const isRemote = isRemoteUrl(asset.src);
      const src = isRemote ? asset.src : resolve(configPathBase, asset.src);

      if (!isRemote) {
        fileExistsOrExit(src);
        if (relative(publicDir, src).includes('..')) {
          log.error(
            `Some CSS or JS is not publically accessible! These must be either remote or places inside the "public" dir (${publicDir})`,
          );
          process.exit(1);
        }
      }

      const { ext } = parse(src);
      const [size] = getFileSizes([src]);

      return {
        src,
        // isInHead: asset.isInHead === true,
        publicPath: isRemote ? src : `/${relative(publicDir, src)}`,
        type: ext.replace('.', ''),
        sizeRaw: size.sizeRaw,
        sizeKb: size.sizeKb,
      };
    }),
  }));
}

/**
 * @param {string[]} patternsDirs
 * @param {BedrockTemplateRenderer[]} templateRenderers
 * @param {function(BedrockAssetSetUserConfig[]): BedrockAssetSet[]} scanAssetSets
 * @param {BedrockAssetSet[]} globalAssetSets
 * @returns {BedrockPattern[]}
 */
function createPatternsData(
  patternsDirs,
  templateRenderers,
  scanAssetSets,
  globalAssetSets,
) {
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

          let doc = '';
          if (template.docPath) {
            const docPath = join(dir, template.docPath);
            if (!fileExists(docPath)) {
              log.error(
                `Template ${
                  template.id
                } has a doc path that points to a file that cannot be found: ${docPath}`,
              );
              process.exit(1);
            }
            doc = fs.readFileSync(docPath, 'utf8');
          }

          const { schema, demoDatas, id: templateId } = template;

          const hasSchema = !!(
            schema &&
            schema.properties &&
            Object.keys(schema.properties).length > 0
          );

          let datas = [{}];
          if (demoDatas) {
            datas = demoDatas;
          } else if (
            hasSchema &&
            schema.examples &&
            schema.examples.length > 0
          ) {
            datas = schema.examples;
          }

          const demoUrls = datas.map(data => {
            const queryString = qs.stringify({
              templateId,
              patternId: pattern.id,
              data,
              isInIframe: false,
              wrapHtml: true,
            });

            return `/api/render?${queryString}`;
          });

          let assetSets = [];
          if (template.assetSets) {
            assetSets = scanAssetSets(template.assetSets);
          }

          globalAssetSets.forEach(globalAssetSet => {
            if (!assetSets.some(a => a.id === globalAssetSet.id)) {
              assetSets.push(globalAssetSet);
            }
          });

          const src = fs.readFileSync(templatePath, 'utf8');

          return {
            ...template,
            demoDatas: datas,
            demoUrls,
            absolutePath: templatePath,
            assetSets,
            doc,
            src,
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

        /** @type {PatternWithMetaSchema} */
        const patternWithMeta = {
          ...results.data,
          dir,
          metaFilePath, // replaces original relative one with absolute path
          meta: metaResults.data,
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
   * @param {string} opt.publicDir
   * @param {string} opt.configPathBase
   * @param {string} opt.dataDir
   * @param {BedrockAssetSetUserConfig[]} opt.assetSets
   * @param {BedrockTemplateRenderer[]} opt.templateRenderers
   */
  constructor({
    newPatternDir,
    patternPaths,
    dataDir,
    templateRenderers,
    assetSets,
    publicDir,
    configPathBase,
  }) {
    this.db = new FileDb({
      dbDir: dataDir,
      name: 'bedrock.patterns',
      defaults: {
        patternStatuses: [
          {
            id: 'draft',
            title: 'Draft',
            color: '#9b9b9b',
          },
          {
            id: 'inProgress',
            title: 'In Progress',
            color: '#FC0',
          },
          {
            id: 'ready',
            title: 'Ready',
            color: '#2ECC40',
          },
        ],
        patternTypes: [
          {
            id: 'components',
            title: 'Components',
          },
        ],
      },
    });

    /**
     * @param {BedrockAssetSetUserConfig[]} newAssetSets
     * @return {BedrockAssetSet[]}
     */
    this.scanAssetSets = newAssetSets =>
      processAssetSets({
        assetSets: newAssetSets,
        publicDir,
        configPathBase,
      });

    /** @type {BedrockAssetSet[]} */
    this.globalAssetSets = this.scanAssetSets(assetSets);

    /** @type {string} */
    this.newPatternDir = newPatternDir;
    /** @type {string[]} */
    this.patternPaths = patternPaths;
    /** @type {string} */
    this.dataDir = dataDir;

    this.templateRenderers = templateRenderers;

    /** @type {string[]} */
    this.patternsDirs = getPatternsDirs(this.patternPaths);

    /** @type {BedrockPattern[]} */
    this.allPatterns = createPatternsData(
      this.patternsDirs,
      this.templateRenderers,
      this.scanAssetSets,
      this.globalAssetSets,
    );
  }

  updatePatternsData() {
    this.patternsDirs = getPatternsDirs(this.patternPaths);
    this.allPatterns = createPatternsData(
      this.patternsDirs,
      this.templateRenderers,
      this.scanAssetSets,
      this.globalAssetSets,
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

  getAllAssetPaths(includeRemote = false) {
    const paths = new Set();
    const patterns = this.getPatterns();
    patterns.forEach(pattern => {
      pattern.templates.forEach(template => {
        template.assetSets.forEach(({ assets }) => {
          assets.forEach(asset => {
            if (includeRemote) {
              paths.add(asset.src);
            } else if (!isRemoteUrl(asset.src)) {
              paths.add(asset.src);
            }
          });
        });
      });
    });

    return [...paths];
  }

  /**
   * @param {string} id
   * @param {string} templateId
   * @param {string} readme
   * @returns {Promise<void>}
   */
  async setPatternTemplateReadme(id, templateId, readme) {
    const pattern = this.getPattern(id);
    const { docPath = null } =
      pattern.templates.find(t => t.id === templateId) || {};

    // Write to the file system
    await fs.writeFile(join(pattern.dir, docPath), readme);
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

  /**
   * @return {{ id: string, title: string, patterns: BedrockPattern[] }[]}
   */
  getPatternTypes() {
    const patterns = this.getPatterns();
    /** @type {BedrockPatternType[]} */
    const patternTypes = this.db.get('patternTypes');
    return patternTypes.map(patternType => ({
      ...patternType,
      patterns: patterns.filter(
        pattern => pattern.meta.type === patternType.id,
      ),
    }));
  }

  /**
   * @param {string} id - ID of pattern type
   * @return {{ id: string, title: string, patterns: BedrockPattern[] }}
   */
  getPatternType(id) {
    return this.getPatternTypes().find(p => p.id === id);
  }

  /**
   * @param {BedrockPatternType[]} patternTypes
   * @return {BedrockPatternType[]}
   */
  setPatternTypes(patternTypes) {
    this.db.set('patternTypes', patternTypes);
    return this.db.get('patternTypes');
  }

  getPatternStatuses() {
    return this.db.get('patternStatuses');
  }

  setPatternStatuses(patternStatuses) {
    this.db.set('patternStatuses', patternStatuses);
    return this.db.get('patternStatuses');
  }

  getPatternSettings() {
    return {
      ...this.db.getAll(),
      patternTypes: this.getPatternTypes(),
    };
  }

  setPatternSettings(settings) {
    this.db.setAll(settings);
  }

  /**
   * @param {string} patternId
   * @return {{ id: string, title: string, demoUrls: string[] }[]}
   */
  getPatternDemoUrls(patternId) {
    const pattern = this.getPattern(patternId);

    return pattern.templates.map(template => ({
      id: template.id,
      title: template.title,
      demoUrls: template.demoUrls,
    }));
  }

  /**
   * @return {{templates: {id: string, title: string, demoUrls: string[]}[], id: Id, title: Title}[]}
   */
  getPatternsDemoUrls() {
    return this.getPatterns().map(pattern => ({
      id: pattern.id,
      title: pattern.meta.title,
      templates: this.getPatternDemoUrls(pattern.id),
    }));
  }

  /**
   * Get code strings to help with how this template is used
   * @param {Object} opt
   * @param {string} opt.patternId
   * @param {string} opt.templateId
   * @param {Object} [opt.data] - data passed to template
   * @return {Promise<BedrockPatternTemplateCode>}
   */
  async getTemplateCode({ patternId, templateId, data }) {
    const pattern = this.getPattern(patternId);
    const template = pattern.templates.find(t => t.id === templateId);
    const renderer = this.templateRenderers.find(t =>
      t.test(template.absolutePath),
    );

    let language = 'bash';
    if (renderer.language) {
      language = renderer.language; // eslint-disable-line
    } else if (renderer.extension) {
      language = renderer.extension.replace('.', '');
    }

    const results = await Promise.all([
      renderer
        .getUsage({ patternId, template, data })
        .then(usage => ({ usage })),
      this.render({
        patternId,
        templateId,
        data,
        wrapHtml: false,
        isInIframe: false,
      }).then(({ ok, html, message }) => {
        if (!ok) {
          log.error(`Error trying to getTemplateCode(): ${message}`, {
            patternId,
            templateId,
            html,
            message,
          });
          throw new Error(message);
        }
        return {
          html,
        };
      }),
    ]);

    const mergedResults = results.reduce(
      (prev, current) => Object.assign(prev, current),
      {},
    );
    return Object.assign(
      {},
      {
        language,
        templateSrc: template.src,
        html: '',
        usage: '',
        data,
      },
      mergedResults,
    );
  }

  watch() {
    const configFilesToWatch = [];
    this.allPatterns.forEach(pattern => {
      configFilesToWatch.push(
        join(pattern.dir, FILE_NAMES.PATTERN_CONFIG),
        join(pattern.dir, FILE_NAMES.PATTERN_META),
        ...pattern.templates
          .filter(t => t.docPath)
          .map(t => join(pattern.dir, t.docPath)),
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

    const localAssetPaths = this.getAllAssetPaths(false);

    const assetWatcher = chokidar.watch(localAssetPaths, {
      ignoreInitial: true,
    });

    assetWatcher.on('all', (event, path) => {
      bedrockEvents.emit(EVENTS.PATTERN_ASSET_CHANGED, { event, path });
    });
  }

  /**
   * Render template
   * @param {Object} opt
   * @param {string} opt.patternId - Pattern Id
   * @param {string} [opt.templateId] - Template Id
   * @param {boolean} [opt.wrapHtml=true] - Should it wrap HTML results with `<head>` and include assets?
   * @param {Object} [opt.data] - Data to pass to template
   * @param {boolean} [opt.isInIframe=false] - Will this be in an iFrame?
   * @param {string} [opt.assetSetId] - Asset Set Id
   * @param {number} [opt.websocketsPort]
   * @return {Promise<BedrockTemplateRenderResults>}
   */
  async render({
    patternId,
    templateId = '',
    wrapHtml = true,
    data = {},
    isInIframe = false,
    websocketsPort,
    assetSetId,
  }) {
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
      const assetSet = assetSetId
        ? template.assetSets.find(a => a.id === assetSetId)
        : template.assetSets[0];

      const {
        assets,
        inlineJs = '',
        inlineCss = '',
        inlineFoot = '',
        inlineHead = '',
      } = assetSet;

      const inlineJSs = [inlineJs];

      if (isInIframe) {
        inlineJSs.push(`
/**
  * Prevents the natural click behavior of any links within the iframe.
  * Otherwise the iframe reloads with the current page or follows the url provided.
  */
const links = Array.prototype.slice.call(document.querySelectorAll('a'));
links.forEach(function(link) {
  link.addEventListener('click', function(e){e.preventDefault();});
});
        `);
      }

      if (!isInIframe && websocketsPort) {
        inlineJSs.push(`
if ('WebSocket' in window && location.hostname === 'localhost') {
  var socket = new window.WebSocket('ws://localhost:8000');
  socket.addEventListener('message', function() {
    window.location.reload();
  });
}
          `);
      }
      const wrappedHtml = renderer.wrapHtml({
        html: renderedTemplate.html,
        headJsUrls: [
          isInIframe
            ? `https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/${iframeResizerVersion}/iframeResizer.contentWindow.min.js`
            : '',
        ].filter(x => x),
        cssUrls: assets
          .filter(asset => asset.type === 'css')
          .map(asset => asset.publicPath),
        jsUrls: assets
          .filter(asset => asset.type === 'js')
          .map(asset => asset.publicPath),
        inlineJs: inlineJSs.join('\n'),
        inlineCss,
        inlineHead,
        inlineFoot,
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
    templateCode: async (
      parent,
      { patternId, templateId, data },
      { patterns },
    ) => patterns.getTemplateCode({ patternId, templateId, data }),
    patternTypes: (parent, args, { patterns }) => patterns.getPatternTypes(),
    patternType: (parent, { id }, { patterns }) => patterns.getPatternType(id),
    patternStatuses: (parent, args, { patterns }) =>
      patterns.getPatternStatuses(),
    patternSettings: (parent, args, { patterns }) =>
      patterns.getPatternSettings(),
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
    setPatternTypes: async (
      parent,
      { patternTypes },
      { patterns, canWrite },
    ) => {
      if (!canWrite) return false;
      return patterns.setPatternTypes(patternTypes);
    },
    setPatternStatuses: async (
      parent,
      { patternStatuses },
      { patterns, canWrite },
    ) => {
      if (!canWrite) return false;
      return patterns.setPatternStatuses(patternStatuses);
    },
    setPatternSettings: async (
      parent,
      { settings },
      { patterns, canWrite },
    ) => {
      if (!canWrite) return false;
      patterns.setPatternSettings(settings);
      return patterns.getPatternSettings();
    },
    setPatternTemplateReadme: async (
      parent,
      { id, templateId, readme },
      { patterns, canWrite },
    ) => {
      if (!canWrite) return false;
      await patterns.setPatternTemplateReadme(id, templateId, readme);
      return patterns.getPattern(id);
    },
  },
  JSON: GraphQLJSON,
};

module.exports = {
  Patterns,
  patternsResolvers,
  patternsTypeDef,
};
