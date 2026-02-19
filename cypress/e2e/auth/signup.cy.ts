// Tests student signup flow
describe('Authentication – Signup', () => {
    const learnerEmail = `learner.${Date.now()}@example.com`;

    // Mocks backend APIs before each test
    beforeEach(() => {
        cy.mockLearnerAPI();
    });

    // Verifies that a student can sign up successfully
    it('student can sign up', () => {
        // Opens signup page
        cy.visit('/signup');

        // Selects student signup and verifies route
        cy.contains("I'm a Student").click();
        cy.url().should('include', '/signup/student');

        // Fills basic signup details
        cy.get('input[name="firstName"]').type('Test');
        cy.get('input[name="lastName"]').type('User');
        cy.get('input[name="email"]').type(learnerEmail);

        // Accepts terms and privacy policy
        cy.get('input[name="agreeToTerms"]').check({ force: true });
        cy.get('input[name="agreeToPrivacy"]').check({ force: true });

        // Proceeds to next step
        cy.contains('button', 'Next').click();

        // Creates and confirms security pattern
        cy.drawPattern();
        cy.contains('button', 'Next').click();
        cy.drawPattern();

        // Confirms successful signup
        cy.url({ timeout: 15000 }).should('include', '/onboarding');
    });
});
