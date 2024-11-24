describe("Patient List Page", () => {
  beforeEach(() => {
    // Configurar o cookie de autenticação
    cy.setCookie(
      ".AspNetCore.Cookies",
      "CfDJ8N-e3r7QuV5MlW4DcmXRk2csdg_zi9MkhwNt9ZxPcI3AKQmhg2JkfQKoZVSy_66ls56nJJ4CBELpD0Ia3prK764WHEIFeNPNu207uw9W8IUKcBJS8OKyvz_LFRdrslUqaogW98W-U37G9L8Jx3wopVUNPMtST_MRRcr6vH4TxHphgrP2enCBCZbaFg2ZhzFUmmIcfLjiLguyREN0oTky5OUR4w5XFUC4oSUKoUBnzEU0L3tupBgEP0DyXdi637ZZtyH16EKdyX7FZpKrVm1aAtF5ox3Glb-WM-rcTY1cYUrjlSnOiseHu5MMZZFg0fwRrcWJKafZKHNk0A8DBOaXWE6UQ-Iwpi_HrIsEA7IS-Y9Pe4tq8jt1GbQXNZkoZbEa9SlFfBIDofejA5KwHsqJd-8_AjzYGSi-1JYRCDzD6IU6Z-8yUEAeg5oOmA7Xo7VX2laU6IS1cH5oQYexZGRNkEOKLtMetwWc27IJ7Gz_hZuxjJ9-kQkwoXdV20uUPkGZtYcvD2tUVu4xjBUCM4797ZttwR1mvSg3qDzOLgsjOD-KAGPoZJvTVzyTcKKYA9SinPwbvjqP3RcOLRqtygV49W0ZJwpwIv8lCKL1XugUvknY"
    );
    cy.visit("/admin/patient");
  });

  it("should render the page correctly", () => {
    cy.contains("button", "Add Patient").should("be.visible");
    cy.get('[data-testid="patient-table"]').should("exist");
  });

  it('should open modal when clicking "Add Patient"', () => {
    cy.contains("button", "Add Patient").click();
    cy.get('[data-testid="patient-modal"]').should("be.visible");
  });

  it("should handle patient actions dropdown", () => {
    cy.get('[data-testid="actions-dropdown"]').first().click();

    cy.contains("Edit").should("be.visible");
    cy.contains("Deactivate").should("be.visible");
    cy.contains("Delete").should("be.visible");
  });

  it("should open delete confirmation dialog", () => {
    cy.get('[data-testid="actions-dropdown"]').first().click();
    cy.contains("Delete").click();

    cy.get('[data-testid="confirmation-dialog"]')
      .should("be.visible")
      .contains("Are you sure you want to delete this patient?");
  });

  it("should perform patient search", () => {
    cy.intercept("GET", "/api/patients/search*", {
      statusCode: 200,
      body: {
        patients: [],
        total: 0,
      },
    }).as("searchPatients");

    cy.get('[data-testid="search-input"]').should("exist").type("John Doe");

    cy.wait("@searchPatients");
  });
});
