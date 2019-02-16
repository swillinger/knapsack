#! /usr/bin/env node
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
const { readFile } = require('fs-extra');
const portfinder = require('portfinder');
const { resolve, relative } = require('path');
const {
  validateUniqueIdsInArray,
  validateDataAgainstSchema,
} = require('@basalt/bedrock-schema-utils');
const { BedrockRendererBase } = require('../server/renderer-base');
const log = require('../cli/log');
const { bedrockEvents, EVENTS } = require('../server/events');
const { version } = require('../../package.json');
const { dirExistsOrExit, fileExistsOrExit } = require('../server/server-utils');
const {
  bedrockDesignTokensSchema,
} = require('../schemas/bedrock-design-tokens.schema');

/**
 * Prepare user config: validate, convert all paths to absolute, assign defaults
 * @param {BedrockUserConfig} userConfig
 * @param {string} from
 * @returns {BedrockConfig}
 * @todo validate with schema and assign defaults
 */
function processConfig(userConfig, from) {
  const {
    patterns,
    public: publicDir,
    dist,
    css,
    js,
    docsDir,
    templates,
    ...rest
  } = userConfig;
  const config = {
    patterns: patterns.map(p => resolve(from, p)),
    public: resolve(from, publicDir),
    css: css ? css.map(x => (x.startsWith('http') ? x : resolve(from, x))) : [],
    js: js ? js.map(x => (x.startsWith('http') ? x : resolve(from, x))) : [],
    dist: resolve(from, dist),
    docsDir: docsDir ? resolve(from, docsDir) : null,
    ...rest,
  };

  // @deprecated - remove in v1.0.0
  if (templates) {
    log.warn(
      'bedrock.config.js prop "templates" is deprecated and has been renamed to "templateRenderers", please rename with no change to config needed. The bots have moved your config to correct spot for now, but this will stop working at 1.0.0',
    );
    config.templateRenderers = templates;
  }

  if (config.css) {
    config.rootRelativeCSS = config.css.map(c => {
      if (c.startsWith('http')) return c;
      return `/${relative(config.public, c)}`;
    });
  }

  if (config.js) {
    config.rootRelativeJs = config.js.map(j => {
      if (j.startsWith('http')) return j;
      return `/${relative(config.public, j)}`;
    });
  }

  const templateRendererResults = validateUniqueIdsInArray(
    config.templateRenderers,
  );
  if (!templateRendererResults.ok) {
    log.error(
      `Each templateRenderer must have a unique id, these do not: ${
        templateRendererResults.duplicateIdList
      }`,
    );
    process.exit(1);
  }

  config.templateRenderers.forEach((templateRenderer, i) => {
    if (templateRenderer instanceof BedrockRendererBase === false) {
      log.error(
        `Each templateRenderer must be an instance of "BedrockRenderer" and ${templateRenderer.id ||
          `number ${i + 1}`} is not`,
      );
      process.exit(1);
    }
  });

  // @todo check if `config.patterns` exists; but can't now as it can contain globs
  dirExistsOrExit(config.public);
  if (config.docsDir) dirExistsOrExit(config.docsDir);
  if (config.css) config.css.forEach(c => fileExistsOrExit(c));
  if (config.js) config.js.forEach(j => fileExistsOrExit(j));

  // checking to make sure all CSS and JS paths are inside the `config.public` directory
  [config.js, config.css].forEach(assets => {
    const assetsNotPublicallyReachable = assets
      .filter(asset => !asset.startsWith('http'))
      .map(asset => relative(config.public, asset))
      .filter(asset => asset.includes('..')).length;
    if (assetsNotPublicallyReachable > 0) {
      log.error(
        `Some CSS or JS is not publically accessible! These must be either remote or places inside the "public" dir (${publicDir})`,
      );
      process.exit(1);
    }
  });

  {
    const { message, ok } = validateDataAgainstSchema(
      bedrockDesignTokensSchema,
      config.designTokens.data,
    );

    if (!ok) {
      log.error(message);
      process.exit(1);
    }
  }

  {
    const { ok, message } = validateUniqueIdsInArray(
      config.designTokens.data.tokens,
      'name',
    );
    if (!ok) {
      log.error(`Error in Design Tokens. ${message}`);
      process.exit(1);
    }
  }

  if (config.designTokens.createCodeSnippet) {
    config.designTokens.data.tokens = config.designTokens.data.tokens.map(
      token => {
        if (token.code) return token;
        return {
          ...token,
          code: config.designTokens.createCodeSnippet(token),
        };
      },
    );
  }
  bedrockEvents.emit(EVENTS.CONFIG_READY, config);

  return config;
}

/**
 * @param {BedrockConfig} config
 * @return {Promise<BedrockMeta>}
 */
async function getMeta(config) {
  return {
    websocketsPort: await portfinder.getPortPromise(),
    bedrockVersion: version,
    changelog: config.changelog
      ? await readFile(config.changelog, 'utf8')
      : null,
    version: config.version,
  };
}

module.exports = {
  processConfig,
  getMeta,
};
