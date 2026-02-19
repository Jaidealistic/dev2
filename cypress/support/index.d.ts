/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        /**
         * Draws a predefined pattern on the PatternLock component.
         * Pattern: 0 -> 1 -> 4 -> 7
         */
        drawPattern(): Chainable<void>;

        /**
         * Mocks all API endpoints required for the Learner flow.
         * Includes: Login, Dashboard, Lessons, Progress, Profile, Lesson Details/Completion.
         */
        mockLearnerAPI(): Chainable<void>;

        /**
         * Helper to log in as a student using the UI.
         */
        loginAsStudent(): Chainable<void>;
    }
}
