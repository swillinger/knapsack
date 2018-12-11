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
 * @param {Object} obj
 * @param {string | DocumentNode} [obj.query] - Plain GraphQL query
 * @param {DocumentNode} [obj.gqlQueryObj] - GraphQL query made from `gql`
 * @param {Object} [obj.variables] - GraphQL variables
 * @return {Promise<Object>}
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
