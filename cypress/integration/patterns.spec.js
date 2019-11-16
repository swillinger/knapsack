/* eslint-disable */
/// <reference types="Cypress" />
/* eslint-enable */

describe('Patterns', () => {
  it('Re-renders when form is edited', () => {
    cy.visit('/pattern/card/twig');
    cy.get('main header h2').as('page-title');
    cy.get('@page-title').should('have.text', 'Card');
    cy.contains('Edit Form');
    cy.get('.rjsf input[label="Body Title"]')
      .clear()
      .type('Robots are awesome');

    cy.wait(3000); // eslint-disable-line
    cy.percySnapshot('Pattern: Card', { widths: [400, 1200] });
    cy.screenshot('Card Pattern after edit');

    // https://github.com/cypress-io/cypress/issues/136#issuecomment-328100955
    cy.get('iframe:first').then($iframe => {
      const iframe = $iframe.contents();
      const title = iframe.find('.card-title');
      expect(title.text()).to.equal('Robots are awesome');
    });
  });
});
