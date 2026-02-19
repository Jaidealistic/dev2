describe('Authentication – Logout', () => {
    beforeEach(() => {
        cy.mockLearnerAPI(); // Ensure backend states are mocked
    });

    it('student can log out from dashboard', () => {
        // 1. Log in first
        cy.loginAsStudent();
        cy.url().should('include', '/learner/dashboard');

        // 2. Click Sign Out
        cy.contains('Sign out', { matchCase: false }).click();

        // 3. Verify logout transition (clearing tokens and redirecting)
        cy.url().should('include', '/login');

        // 4. Verify restricted access after logout
        cy.visit('/learner/dashboard');
        cy.url().should('include', '/login');
    });
});
