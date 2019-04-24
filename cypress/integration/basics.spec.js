/* eslint-disable */
/// <reference types="Cypress" />
/* eslint-enable */

describe('Basics', () => {
  it('homepage', () => {
    cy.visit('/');
    cy.contains('A Design System');
    // Take a snapshot for visual diffing
    cy.percySnapshot('homepage', { widths: [414, 1200] });
    cy.contains('Patterns').click();
    cy.url().should('include', '/patterns');
  });

  it('Pattern: Card', () => {
    cy.visit('/pattern/card');
    cy.contains('Edit Form');
    cy.wait(5000); // eslint-disable-line
    cy.percySnapshot('card before edit');
    cy.get('.rjsf input[label="Title"]')
      .clear()
      .type('Robots are awesome');
    cy.get('.rjsf select').select('right');
    cy.wait(5000); // eslint-disable-line
    cy.percySnapshot('card after edit');
  });
});
