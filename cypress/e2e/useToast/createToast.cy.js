/// <reference types="cypress" />

describe("Test the toast ", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("should create a container and a wrapper for toasts", () => {
    cy.get("#toastContainer").should("exist");
    cy.get("#toastWrapper").should("exist");
  });

  it("should create a wrapper in an existing container", () => {
    cy.get("#app").should("exist");
    cy.get("#toastWrapper").should("exist");
  });

  it("displays correctly a basic toast when a button is pressed", () => {
    cy.get("button").click({ multiple: true });

    cy.get("#toastWrapper>div").its("length").should("eq", 3);
  });
});
