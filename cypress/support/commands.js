Cypress.Commands.add('getByTestId', (dataTest) => {
  return cy.get(`[data-test=${dataTest}]`);
});

Cypress.Commands.add(
  'shouldHaveAtLeastOneAttr',
  { prevSubject: true },
  (subject, attrs) => {
    const foundAttrs = [];
    for (const attr of attrs) {
      subject[0].getAttribute(attr) && foundAttrs.push(attr);
    }
    expect(foundAttrs).to.have.lengthOf.greaterThan(0);
  }
);
