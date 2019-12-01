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
import qs from 'qs';
import { DocumentNode } from 'graphql';
import { apiUrlBase, graphqlBase } from '../lib/constants';
import {
  KnapsackTemplateData,
  KnapsackTemplateDemo,
} from '../schemas/patterns';
import { AppState } from './store';
import { KsRenderResults } from '../schemas/knapsack-config';

/**
 * GraphQL Query Object to String
 * @param gqlQueryObject -  GraphQL query made from `gql` - https://github.com/apollographql/graphql-tag/issues/150
 * @return {string}
 */
export function gqlToString(gqlQueryObject: DocumentNode): string {
  return gqlQueryObject.loc.source.body;
}

export interface GraphQlResponse {
  data?: any;
  errors?: {
    message: string;
    extensions: {
      code: string;
      stacktrace: string[];
    };
    locations: {
      line: number;
      column: number;
    }[];
  }[];
}

/**
 * GraphQL Query
 * Must pass in `query` OR `gqlQuery`
 */
export function gqlQuery({
  query,
  gqlQueryObj,
  variables = {},
}: {
  /**
   * Plain GraphQL query
   */
  query?: string | DocumentNode;
  /**
   * GraphQL query made from `gql`
   */
  gqlQueryObj?: DocumentNode;
  /**
   * GraphQL variables
   */
  variables?: object;
}): Promise<GraphQlResponse> {
  if (!query && !gqlQueryObj) {
    throw new Error('Must provide either "query" or "gqlQueryObj".');
  }

  if (typeof query !== 'string') {
    if (gqlQueryObj.kind !== 'Document') {
      throw new Error('"gqlQueryObj" not a valid GraphQL document.');
    }
    // get the plain string from the `gql` parsed object
    query = gqlToString(gqlQueryObj); // eslint-disable-line no-param-reassign
  }

  return window
    .fetch(graphqlBase, {
      method: 'POST',
      headers: {
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Connection: 'keep-alive',
        Dnt: '1',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
    .then(res => res.json())
    .catch(console.log.bind(console));
}

type KnapsackDesignToken = import('@knapsack/core/dist/types').KnapsackDesignToken;

export function getDesignTokens(): Promise<KnapsackDesignToken[]> {
  return window.fetch(`${apiUrlBase}/design-tokens`).then(res => res.json());
}

/**
 * Save data up on server to be used in template rendering with `dataId` query param later
 * @returns dataId that is md5 hash
 */
export function saveData(data: object): Promise<string> {
  return window
    .fetch(`${apiUrlBase}/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(res => res.json())
    .then(results => {
      if (!results.ok) {
        console.error(
          `Uh oh! Tried to save data by uploading it to '${apiUrlBase}/data' with no luck.`,
          {
            data,
            results,
          },
        );
      }
      return results.data.hash;
    })
    .catch(console.log.bind(console));
}

export function getInitialState(): Promise<AppState> {
  return window
    .fetch(`${apiUrlBase}/data-store`)
    .then(res => res.json())
    .then(initialState => {
      // console.log({ initialState });
      return initialState;
    })
    .catch(console.log.bind(console));
}

export function renderTemplate(options: {
  patternId: string;
  templateId: string;
  assetSetId?: string;
  /**
   * Data id from `saveData()`
   */
  dataId?: string;
  /**
   * Should it wrap HTML results with `<head>` and include assets?
   */
  wrapHtml?: boolean;
  /**
   * Will this be in an iFrame?
   */
  isInIframe?: boolean;
}): Promise<KsRenderResults> {
  return window
    .fetch(`${apiUrlBase}/render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(options),
    })
    .then(res => res.json())
    .catch(console.log.bind(console));
}

/**
 * Get a URL where this Pattern's Template can be viewed
 */
export async function getTemplateInfo({
  patternId,
  templateId,
  assetSetId,
  wrapHtml,
  isInIframe,
  // data,
  demo,
  extraParams = {},
}: {
  patternId: string;
  templateId?: string;
  assetSetId?: string;
  wrapHtml?: boolean;
  isInIframe?: boolean;
  // data?: KnapsackTemplateData;
  demo: KnapsackTemplateDemo;
  extraParams?: object;
}): Promise<
  {
    url: string;
  } & KsRenderResults
> {
  const dataId = await saveData(demo);
  const query: Record<string, any> = {
    patternId,
    ...extraParams,
  };
  if (templateId) query.templateId = templateId;
  if (assetSetId) query.assetSetId = assetSetId;
  if (typeof wrapHtml === 'boolean') query.wrapHtml = wrapHtml;
  if (typeof isInIframe === 'boolean') query.isInIframe = isInIframe;
  const renderResults = await renderTemplate({
    patternId,
    templateId,
    dataId,
    assetSetId,
    isInIframe,
    wrapHtml,
  });
  const url = `${apiUrlBase}/render?${qs.stringify({ ...query, dataId })}`;
  return {
    url,
    ...renderResults,
  };
}
