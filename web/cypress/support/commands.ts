import "@testing-library/cypress/add-commands";

// Declaração global para o comando `loginAsAdmin`
declare global {
  namespace Cypress {
    interface Chainable {
      loginAsAdmin(): Chainable<void>;
    }
  }
}

// Comando customizado para realizar o login como admin
Cypress.Commands.add("loginAsAdmin", () => {
  // Configurar o cookie de autenticação
  cy.setCookie(
    ".AspNetCore.Cookies",
    "CfDJ8N-e3r7QuV5MlW4DcmXRk2csdg_zi9MkhwNt9ZxPcI3AKQmhg2JkfQKoZVSy_66ls56nJJ4CBELpD0Ia3prK764WHEIFeNPNu207uw9W8IUKcBJS8OKyvz_LFRdrslUqaogW98W-U37G9L8Jx3wopVUNPMtST_MRRcr6vH4TxHphgrP2enCBCZbaFg2ZhzFUmmIcfLjiLguyREN0oTky5OUR4w5XFUC4oSUKoUBnzEU0L3tupBgEP0DyXdi637ZZtyH16EKdyX7FZpKrVm1aAtF5ox3Glb-WM-rcTY1cYUrjlSnOiseHu5MMZZFg0fwRrcWJKafZKHNk0A8DBOaXWE6UQ-Iwpi_HrIsEA7IS-Y9Pe4tq8jt1GbQXNZkoZbEa9SlFfBIDofejA5KwHsqJd-8_AjzYGSi-1JYRCDzD6IU6Z-8yUEAeg5oOmA7Xo7VX2laU6IS1cH5oQYexZGRNkEOKLtMetwWc27IJ7Gz_hZuxjJ9-kQkwoXdV20uUPkGZtYcvD2tUVu4xjBUCM4797ZttwR1mvSg3qDzOLgsjOD-KAGPoZJvTVzyTcKKYA9SinPwbvjqP3RcOLRqtygV49W0ZJwpwIv8lCKL1XugUvknY"
  );
});
