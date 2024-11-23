// cypress/e2e/admin-menu.cy.ts
describe("AdminMenu", () => {
  beforeEach(() => {
    // Visit the admin page before each test
    cy.visit("/admin");

    // Stub the module response
    cy.intercept("GET", "**/api/menu-options", {
      statusCode: 200,
      body: {
        menuOptions: [
          { id: 1, label: "Dashboard", path: "/admin/dashboard" },
          { id: 2, label: "Patients", path: "/admin/patients" },
          { id: 3, label: "Staff", path: "/admin/staff" },
          { id: 4, label: "Operations", path: "/admin/operations" },
        ],
      },
    }).as("getMenuOptions");
  });

  context("Desktop View", () => {
    beforeEach(() => {
      // Set viewport to desktop size
      cy.viewport(1024, 768);
    });

    it("should display sidebar menu on desktop", () => {
      cy.get(".lg\\:block").should("be.visible");
      cy.get(".lg\\:hidden").should("not.be.visible");
    });

    it("should display welcome message and all menu sections", () => {
      cy.contains("Welcome to the Admin Panel!").should("be.visible");
      cy.contains("Manage Patients").should("be.visible");
      cy.contains("Manage Staff").should("be.visible");
      cy.contains("Manage Operation Types").should("be.visible");
    });

    it("should have working navigation links in sidebar", () => {
      cy.get(".lg\\:block").within(() => {
        cy.contains("Dashboard").click();
        cy.url().should("include", "/admin/dashboard");

        cy.contains("Patients").click();
        cy.url().should("include", "/admin/patients");

        cy.contains("Staff").click();
        cy.url().should("include", "/admin/staff");

        cy.contains("Operations").click();
        cy.url().should("include", "/admin/operations");
      });
    });
  });

  context("Mobile View", () => {
    beforeEach(() => {
      // Set viewport to mobile size
      cy.viewport(375, 667);
    });

    it("should display hamburger menu on mobile", () => {
      cy.get(".lg\\:hidden").should("be.visible");
      cy.get(".lg\\:block").should("not.be.visible");
    });

    it("should toggle mobile menu when hamburger is clicked", () => {
      cy.get(".lg\\:hidden button").first().click(); // Assuming first button is hamburger
      cy.get(".fixed.top-0.left-0").should("be.visible");

      // Click outside to close
      cy.get(".bg-\\[rgba\\(0\\,0\\,0\\,0\\.5\\)\\]").click({ force: true });
      cy.get(".fixed.top-0.left-0").should("not.exist");
    });

    it("should have working navigation in mobile menu", () => {
      cy.get(".lg\\:hidden button").first().click();

      cy.get(".fixed.top-0.left-0").within(() => {
        cy.contains("Dashboard").click();
        cy.url().should("include", "/admin/dashboard");
      });
    });
  });

  context("Alert Messages", () => {
    it("should display alert message when present", () => {
      // Stub the module with alert message
      cy.intercept("GET", "**/api/alert-message", {
        statusCode: 200,
        body: {
          alertMessage: "System maintenance scheduled",
        },
      }).as("getAlertMessage");

      cy.reload();
      cy.get('[role="alert"]').should("be.visible");
      cy.contains("System maintenance scheduled").should("be.visible");
    });

    it("should not display alert when there is no message", () => {
      // Stub the module with no alert message
      cy.intercept("GET", "**/api/alert-message", {
        statusCode: 200,
        body: {
          alertMessage: null,
        },
      }).as("getAlertMessage");

      cy.reload();
      cy.get('[role="alert"]').should("not.exist");
    });
  });

  context("Dark Mode", () => {
    it("should apply dark mode styles when enabled", () => {
      // Assuming you have a dark mode toggle somewhere
      cy.get("html").invoke("addClass", "dark");

      // Check if dark mode styles are applied
      cy.get(".dark\\:from-\\[#1f2937\\]").should("be.visible");
      cy.get(".dark\\:bg-\\[#2d2f3f\\]").should("be.visible");
    });
  });

  context("Accessibility", () => {
    it("should have proper ARIA labels and roles", () => {
      // Check for proper heading structure
      cy.get("h1").contains("Admin Panel").should("be.visible");

      // Check for proper button accessibility
      cy.get("button").should("have.attr", "aria-label");

      // Check for proper navigation role
      cy.get("nav").should("exist");
    });
  });
});
