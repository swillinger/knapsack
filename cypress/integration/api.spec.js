/* eslint-disable */
/// <reference types="Cypress" />
/* eslint-enable */

describe.only('API', () => {
  it('Accesses Pattern data via GraphQL', () => {
    cy.request('POST', '/graphql', {
      query: `
        {
          patternTypes {
            id
            title
          }
          patterns {
            id
            meta {
              title
              description
              type
              status
              hasIcon
            }
          }
          patternStatuses {
            id
            title
            color
          }
        }
      `,
    }).then(({ status, body: { data } }) => {
      expect(status).to.equal(200);
      assert.isAbove(
        data.patterns.length,
        0,
        'More Patterns than 0 are returned',
      );
      assert.isAbove(
        data.patternTypes.length,
        0,
        'More Patterns Types than 0 are returned',
      );
      assert.isAbove(
        data.patternStatuses.length,
        0,
        'More Patterns Statuses than 0 are returned',
      );
    });
  });

  it('Accesses Design Token data via GraphQL', () => {
    cy.request('POST', '/graphql', {
      query: `
        {
          tokens {
            name
            value
          }
        }
      `,
    }).then(({ status, body: { data } }) => {
      expect(status).to.equal(200);
      assert.isAbove(
        data.tokens.length,
        0,
        'More Design Tokens than 0 are returned',
      );
    });
  });
});
