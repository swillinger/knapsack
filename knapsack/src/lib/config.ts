/**
 *  Copyright (C) 2018 Basalt
 This file is part of Knapsack.
 Knapsack is free software; you can redistribute it and/or modify it
 under the terms of the GNU General Public License as published by the Free
 Software Foundation; either version 2 of the License, or (at your option)
 any later version.

 Knapsack is distributed in the hope that it will be useful, but WITHOUT
 ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
 more details.

 You should have received a copy of the GNU General Public License along
 with Knapsack; if not, see <https://www.gnu.org/licenses>.
 */
import { resolve } from 'path';
import {
  validateUniqueIdsInArray,
  validateDataAgainstSchema,
} from '@knapsack/schema-utils';
import { knapsackDesignTokensSchema } from '@knapsack/core/dist/types';
import { KnapsackRendererBase } from '../server/renderer-base';
import * as log from '../cli/log';
import { knapsackEvents, EVENTS } from '../server/events';
import { dirExistsOrExit } from '../server/server-utils';
import { KnapsackConfig } from '../schemas/knapsack-config';

/**
 * Handle backwards compatibility of config
 */
function convertOldConfig(config: KnapsackConfig): KnapsackConfig {
  // handle backward compatibility here, may need to make new Interface
  return config;
}

/**
 * @todo validate with schema and assign defaults
 */
function validateConfig(config: KnapsackConfig): boolean {
  const templateRendererResults = validateUniqueIdsInArray(
    config.templateRenderers,
  );
  if (!templateRendererResults.ok) {
    log.error(
      `Each templateRenderer must have a unique id, these do not: ${templateRendererResults.duplicateIdList}`,
    );
    process.exit(1);
  }

  config.templateRenderers.forEach((templateRenderer, i) => {
    if (templateRenderer instanceof KnapsackRendererBase === false) {
      log.error(
        `Each templateRenderer must be an instance of "KnapsackRenderer" and ${templateRenderer.id ||
          `number ${i + 1}`} is not`,
      );
      process.exit(1);
    }
  });

  // @todo check if `config.patterns` exists; but can't now as it can contain globs
  dirExistsOrExit(config.public);

  if (config.designTokens?.data) {
    {
      const { message, ok } = validateDataAgainstSchema(
        knapsackDesignTokensSchema,
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
  }

  if (config.designTokens?.createCodeSnippet) {
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

  return true;
}

/**
 * Prepare user config: validate, convert all paths to absolute, assign defaults
 */
export function processConfig(
  userConfig: KnapsackConfig,
  from: string,
): KnapsackConfig {
  const { public: publicDir, dist, ...rest } = convertOldConfig(userConfig);

  const config = {
    public: resolve(from, publicDir),
    dist: resolve(from, dist),
    ...rest,
  };

  const ok = validateConfig(config);
  if (!ok) process.exit(1);

  knapsackEvents.emit(EVENTS.CONFIG_READY, config);

  return config;
}
