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
    cy.url().should('include', '/patterns/all');
    cy.get('main > header h2').should('have.text', 'Patterns');
    // cy.screenshot('Patterns All');
    cy.get('.header')
      .contains('Page Builder')
      .click();
    cy.url().should('include', '/pages');
    // cy.screenshot('Page Builder landing');
    cy.contains('Simple Example').click();
    // cy.screenshot('Page Builder Simple Example page');
    cy.get('.header')
      .contains('Design Tokens')
      .click();
    // cy.screenshot('First Design Tokens page');
    cy.contains('Colors').click();
    // cy.screenshot('Colors Design Tokens page');
  });
});
