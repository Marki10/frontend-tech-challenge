/// <reference types="cypress" />

describe("Add Treatment Dialog", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/treatments*", (req) => {
      expect(req.query).to.have.property("page", "1");
      expect(req.query).to.have.property("pageSize", "10");

      req.reply({
        statusCode: 200,
        body: {
          treatments: [],
          total: 0,
          page: 1,
          pageSize: 10,
        },
      });
    }).as("getTreatments");

    cy.visit("/?page=1&pageSize=10");
    cy.wait("@getTreatments");
  });

  it("should open the add treatment dialog and fill the form", () => {
    cy.intercept("POST", "/api/treatments", {
      statusCode: 201,
      body: { success: true },
    }).as("addTreatment");

    cy.contains("button", /add treatment/i).click();

    cy.get('[role="dialog"]', { timeout: 10000 }).should("be.visible");

    cy.get('input[name="patient"]').type("John Doe");
    cy.get('input[name="procedure"]').type("Dental Checkup");
    cy.get('input[name="dentist"]').type("Dr. Smith");
    cy.get('input[type="date"]').type("2025-12-31");
    cy.get('textarea[name="notes"]').type("Regular checkup");

    cy.contains("button", /save treatment/i).click();

    cy.wait("@addTreatment").then((interception) => {
      expect(interception.request.body).to.deep.equal({
        patient: "John Doe",
        procedure: "Dental Checkup",
        dentist: "Dr. Smith",
        date: "2025-12-31",
        notes: "Regular checkup",
      });
    });

    cy.get('[role="dialog"]').should("not.exist");
  });
});
