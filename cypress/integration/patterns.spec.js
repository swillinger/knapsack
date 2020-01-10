/* eslint-disable */
/// <reference types="Cypress" />
/* eslint-enable */

describe('Patterns', () => {
  it('Re-renders when form is edited', () => {
    cy.visit('/pattern/card/twig');
    cy.get(
      '.ks-pattern-view-page__header__info-wrap__title .ks-inline-edit__text',
    ).as('page-title');

    cy.get('@page-title').should('have.text', 'Card');

    // waits for template to be ready
    cy.get('.ks-demo-stage .ks-template--ready');
    cy.get('.ks-demo-stage')
      .first()
      .screenshot('demo-stage');
    cy.get('.ks-spec-docs__properties');
    cy.screenshot('pattern-page', {
      // capture: 'fullPage',
      // timeout: 7000,
    });
    // @todo fix weird delay where sometimes the last keystroke is not rendered in template
    cy.get('.ks-demo-stage__form .ks-rjsf input[label="Title"]')
      .clear()
      .type('Robots are awesome', {
        delay: 120,
      });

    // waits for template to be ready
    cy.get('.ks-demo-stage .ks-template--ready');
    cy.percySnapshot('Pattern: Card', { widths: [1200] });
    cy.screenshot('Card Pattern after edit');

    // https://github.com/cypress-io/cypress/issues/136#issuecomment-328100955
    cy.get('.ks-demo-stage__stage iframe:first').then($iframe => {
      const iframe = $iframe.contents();
      const title = iframe.find('.card-title');
      expect(title.text().trim()).to.equal('Robots are awesome');
    });
  });
});
