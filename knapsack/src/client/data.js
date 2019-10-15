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

export const apiUrlBase = '/api'; // @todo refactor
export const graphqlBase = '/graphql';

/**
 * GraphQL Query Object to String
 * @param {DocumentNode} gqlQueryObject -  GraphQL query made from `gql`
 * @return {string}
 */
export function gqlToString(gqlQueryObject) {
  return gqlQueryObject.loc.source.body;
}

/**
 * GraphQL Query
 * Must pass in `query` OR `gqlQuery`
 * @param {object} obj
 * @param {string | DocumentNode} [obj.query] - Plain GraphQL query
 * @param {DocumentNode} [obj.gqlQueryObj] - GraphQL query made from `gql`
 * @param {object} [obj.variables] - GraphQL variables
 * @return {Promise<object>}
 * @async
 */
export function gqlQuery({ query, gqlQueryObj, variables = {} }) {
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

/**
 * Save data up on server to be used in template rendering with `dataId` query param later
 * @param {object} data
 * @returns {Promise<string>} dataId that is md5 hash
 */
export function saveData(data) {
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

/**
 * @param {object} opt
 * @param {string} opt.patternId
 * @param {string} [opt.templateId]
 * @param {string} [opt.assetSetId]
 * @param {boolean} [opt.wrapHtml]
 * @param {boolean} [opt.isInIframe]
 * @param {object} [opt.extraParams] - extra query parameters added
 * @returns {string} root relative url for viewing rendered pattern
 */
export async function getTemplateUrl({
  patternId,
  templateId,
  assetSetId,
  wrapHtml,
  isInIframe,
  data,
  extraParams = {},
}) {
  const dataId = await saveData(data);
  const query = {
    patternId,
    ...extraParams,
  };
  if (templateId) query.templateId = templateId;
  if (assetSetId) query.assetSetId = assetSetId;
  if (typeof wrapHtml === 'boolean') query.wrapHtml = wrapHtml;
  if (typeof isInIframe === 'boolean') query.isInIframe = isInIframe;

  return `/api/render?${qs.stringify({ ...query, dataId })}`;
}
