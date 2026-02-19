// Tests student login flow
describe('Authentication – Login', () => {

    // Mocks backend APIs before each test
    beforeEach(() => {
        cy.mockLearnerAPI();
    });

    // Verifies that a student can log in successfully
    it('student can log in', () => {
        // Opens login page
        cy.visit('/login');
        cy.wait(500);

        // Enters credentials and submits login
        cy.get('input[type="email"]').type('learner@linguaaccess.com', { force: true });
        cy.contains('Continue').click();
        cy.get('input[type="password"]').type('learner123');
        cy.contains('Sign In').click();

        // Confirms successful login
        cy.url({ timeout: 10000 }).should('include', '/learner/dashboard');
        cy.contains('Learner').should('be.visible');
    });
});
