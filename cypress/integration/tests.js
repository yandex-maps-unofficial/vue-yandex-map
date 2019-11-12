describe('Check functionality', () => {
  it('maps should load', () => {
    cy.visit('/');

    cy.get('.passedMap1 input[value="loaded"]')
      .should('be.checked');

    cy.get('.passedMap2 input[value="loaded"]')
      .should('be.checked');

    cy.get('.passedMap3 input[value="loaded"]')
      .should('be.checked');
  });

  it('markers should be edit', () => {
    cy.get('#changeButton')
      .click();

    cy.get('.passedMap1 input[value="edited"]')
      .should('be.checked');

    cy.get('.passedMap2 input[value="edited"]')
      .should('be.checked');

    cy.get('.passedMap3 input[value="edited"]')
      .should('be.checked');
  });

  it('markers should be delete', () => {
    cy.get('#filterButton')
      .click();

    cy.get('.passedMap1 input[value="filtered"]')
      .should('be.checked');

    cy.get('.passedMap2 input[value="filtered"]')
      .should('be.checked');

    cy.get('.passedMap3 input[value="filtered"]')
      .should('be.checked');
  });
});
