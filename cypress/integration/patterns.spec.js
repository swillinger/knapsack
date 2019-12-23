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

    // @todo fix weird delay where sometimes the last keystroke is not rendered in template
    cy.get(
      '.ks-demo-stage__form .ks-rjsf .ks-rjsf__string-field--cardTitle input',
    )
      .clear()
      .type('Robots are awesome');

    cy.wait(3000); // eslint-disable-line
    cy.percySnapshot('Pattern: Card', { widths: [400, 1200] });
    cy.screenshot('Card Pattern after edit');

    // https://github.com/cypress-io/cypress/issues/136#issuecomment-328100955
    cy.get('.ks-demo-stage__stage iframe:first').then($iframe => {
      const iframe = $iframe.contents();
      const title = iframe.find('.card-title');
      expect(title.text().trim()).to.equal('Robots are awesome');
    });
  });
});
