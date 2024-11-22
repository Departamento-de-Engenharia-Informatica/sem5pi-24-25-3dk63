describe("Patient List Page", () => {
  beforeEach(() => {
    cy.loginAsAdmin(); // Assuming this is a custom command for authentication
    cy.visit("/admin/patient");
  });

  it("should render the page correctly", () => {
    // Check for main elements
    cy.contains("button", "Add Patient").should("be.visible");
    cy.get('[data-testid="patient-table"]').should("exist");
  });

  it('should open modal when clicking "Add Patient"', () => {
    // Open add patient modal
    cy.contains("button", "Add Patient").click();
    cy.get('[data-testid="patient-modal"]').should("be.visible");
  });

  it("should handle patient actions dropdown", () => {
    // Open actions dropdown for first patient
    cy.get('[data-testid="actions-dropdown"]').first().click();

    // Check dropdown menu items
    cy.contains("Edit").should("be.visible");
    cy.contains("Deactivate").should("be.visible");
    cy.contains("Delete").should("be.visible");
  });

  it("should open delete confirmation dialog", () => {
    // Open actions dropdown and click delete
    cy.get('[data-testid="actions-dropdown"]').first().click();
    cy.contains("Delete").click();

    // Check confirmation dialog
    cy.get('[data-testid="confirmation-dialog"]')
      .should("be.visible")
      .contains("Are you sure you want to delete this patient?");
  });

  it("should perform patient search", () => {
    // Intercept search API call
    cy.intercept("GET", "/api/patients/search*", {
      statusCode: 200,
      body: {
        patients: [],
        total: 0,
      },
    }).as("searchPatients");

    // Perform search
    cy.get('[data-testid="search-input"]').should("exist").type("John Doe");

    cy.wait("@searchPatients");
  });
});
