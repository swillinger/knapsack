/* eslint-disable */
/// <reference types="Cypress" />
/* eslint-enable */

describe('Site Navigation', () => {
  it('Navigates between main menu items', () => {
    cy.visit('/');
    cy.contains('Knapsack Demo');
    // Take a snapshot for visual diffing
    // cy.percySnapshot('homepage', { widths: [414, 1200] });
    // cy.screenshot('homepage');
    cy.contains('Patterns').click();
    cy.url().should('include', '/patterns');
  });
});
