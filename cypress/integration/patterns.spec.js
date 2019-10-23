/* eslint-disable */
/// <reference types="Cypress" />
/* eslint-enable */

describe('Patterns', () => {
  it('Re-renders when form is edited', () => {
    cy.visit('/pattern/card/twig');
    cy.get('main > header h2').as('page-title');
    cy.get('@page-title').should('have.text', 'Card');
    cy.contains('Edit Form');
    cy.get('.rjsf input[label="Body Title"]')
      .clear()
      .type('Robots are awesome');

    cy.wait(2000); // eslint-disable-line
    cy.percySnapshot('Pattern: Card', { widths: [400, 1200] });
    cy.screenshot('Card Pattern after edit');

    // https://github.com/cypress-io/cypress/issues/136#issuecomment-328100955
    cy.get('iframe:first').then($iframe => {
      const iframe = $iframe.contents();
      const title = iframe.find('.card-title');
      expect(title.text()).to.equal('Robots are awesome');
    });
  });

  it('Allows editing of metadata', () => {
    const metaFilePath =
      '../examples/bootstrap/assets/patterns/card/knapsack.pattern-meta.json';
    cy.visit('/pattern/card/twig');
    cy.contains('Edit Meta').click();
    cy.get('main input[label="Title"]')
      .then($title => {
        const [el] = $title;
        const originalTitle = el.getAttribute('value');
        expect(originalTitle).to.equal('Card');
      })
      .type('{selectall}')
      .type('Super Card');
    cy.percySnapshot('Pattern Edit: Card', { widths: [400, 1200] });

    cy.get('main form select[id*="status"]')
      .then($select => {
        const [el] = $select;
        const originalStatus = el.selectedOptions[0].value;
        expect(originalStatus).to.equal('ready');
      })
      .select('draft');

    cy.get('main form').submit();

    cy.readFile(metaFilePath)
      .its('title')
      .should('equal', 'Super Card');
    cy.readFile(metaFilePath)
      .its('status')
      .should('equal', 'draft');

    cy.get('main > header h2').should('have.text', 'Super Card');
    cy.get('main > header').contains('Status: Draft');

    cy.contains('Edit Meta').click();

    cy.get('main input[label="Title"]')
      .type('{selectall}')
      .type('Card');

    cy.get('main form select[id*="status"]').select('ready');
    cy.get('main form').submit();

    cy.readFile(metaFilePath)
      .its('title')
      .should('equal', 'Card');
    cy.readFile(metaFilePath)
      .its('status')
      .should('equal', 'ready');

    cy.get('main > header h2').should('have.text', 'Card');
    cy.get('main > header').contains('Status: Ready');

    cy.exec(`git status --porcelain ${metaFilePath}`).then(({ stdout }) => {
      assert.equal(
        stdout.length,
        0,
        'Expecting no git changes have been done to Pattern Meta file',
      );
    });
  });
});
