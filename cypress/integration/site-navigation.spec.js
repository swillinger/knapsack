/* eslint-disable */
/// <reference types="Cypress" />
/* eslint-enable */

describe('Site Navigation', () => {
  it('Navigates between main menu items', () => {
    cy.visit('/');
    cy.get('.ks-site-header').contains('Knapsack Bootstrap Demo');
    cy.contains('Knapsack Bootstrap Demo');
    cy.get('.ks-home-splash__inner__version').then($version => {
      // keeping consistent so it doesn't keep failing Percy Visual Regression Testing
      $version[0].textContent = '1.2.3';
    });
    // Take a snapshot for visual diffing
    cy.percySnapshot('homepage', { widths: [1200] });
    cy.screenshot('homepage', {
      capture: 'fullPage',
    });
    cy.contains('Patterns').click();
    cy.url().should('include', '/patterns');
    cy.get('.ks-page-header__title').should('have.text', 'Patterns');

    cy.percySnapshot('Patterns landing', { widths: [1200] });
    cy.screenshot('Patterns landing');
    // cy.get('.header')
    //   .contains('Page Builder')
    //   .click();
    // cy.url().should('include', '/pages');
    // cy.get(
    //   '.page-with-sidebar__sidebar .pattern-nav-list__item--heading',
    // ).contains('Page Builder');
    // // cy.screenshot('Page Builder landing');
    // cy.percySnapshot('Page Builder landing', { widths: [1200] });
    // cy.contains('Simple Example').click();
    // cy.get('main > div > h2').should('have.text', 'Simple Example');
    // cy.wait(3000); // eslint-disable-line
    // // cy.screenshot('Page Builder Simple Example page');
    // cy.percySnapshot('Page Builder Simple Example page', {
    //   widths: [400, 1200],
    // });
    // cy.get('.header')
    //   .contains('Design Tokens')
    //   .click();
    // cy.get(
    //   '.page-with-sidebar__sidebar .pattern-nav-list__item--heading',
    // ).contains('Design Tokens');
    // // cy.screenshot('First Design Tokens page');
    // cy.get('main > header > div > h3').should('have.text', 'Animation');
    // cy.percySnapshot('First Design Tokens page', { widths: [400, 1200] });
    // cy.contains('Colors').click();
    // cy.get('main > header > div > h3').should('have.text', 'Colors');
    // cy.contains('Color Format:');
    // // cy.screenshot('Colors Design Tokens page');
    // cy.percySnapshot('Colors Design Tokens page', { widths: [400, 1200] });
  });
});
