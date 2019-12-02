/* eslint-disable */
/// <reference types="Cypress" />
/* eslint-enable */

describe('Add Page', () => {
  it('Adds new page', () => {
    cy.visit('/patterns');
    cy.get('.ks-sidebar__enable-edit-btn').click();

    cy.get('.ks-add-entity').click();

    cy.get('#page').check();

    cy.get('input[name="title"]').type('Glitter');

    cy.get('.ks-add-entity__popup')
      .find('form')
      .submit();

    cy.wait(3000); // eslint-disable-line
    cy.percySnapshot('Add Page', { widths: [1200] });
    cy.screenshot('Adding New Page Template');

    cy.get('.ks-side-nav-item__title-container')
      .contains('Glitter')
      .should('exist');
  });
});
