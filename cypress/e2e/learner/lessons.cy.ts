// Tests learner lesson flow
describe('Learner – Lessons', () => {

    // Mocks backend APIs before each test
    beforeEach(() => {
        cy.mockLearnerAPI();
    });

    // Verifies that a student can complete a lesson
    it('student can complete a lesson', () => {
        cy.loginAsStudent();

        // Opens learner lessons page
        cy.visit('/learner/lessons');

        // Selects and opens a specific lesson
        cy.contains('article', 'Greeting Phase 1').find('a').click();

        // Proceeds through lesson and completes it
        cy.contains('Next').click();
        cy.contains('Complete Lesson').click();

        // Confirms lesson completion
        cy.contains('Lesson Complete').should('be.visible');
    });
});
