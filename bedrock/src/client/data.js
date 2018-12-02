export const apiUrlBase = '/api'; // @todo refactor

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
    query = gqlQueryObj.loc.source.body; // eslint-disable-line no-param-reassign
  }

  return window
    .fetch('/graphql', {
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
