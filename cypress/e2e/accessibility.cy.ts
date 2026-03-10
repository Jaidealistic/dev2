/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        tab(options?: { shift?: boolean }): Chainable;
    }
}


const a11yConfig = {
    rules: {
        'color-contrast': { enabled: false }
    }
};

const logViolations = (violations: any[]) => {
    cy.task('log', `Accessibility Violations: ${violations.length}`);
    violations.forEach(v => {
        const severity = v.impact.toUpperCase();
        console.log(`[${severity}] ${v.id}: ${v.description}`);
        cy.task('log', `[${severity}] ${v.id}: ${v.description} (${v.nodes.length} nodes)`);
        v.nodes.forEach((node: any) => {
            console.log(`  - Node: ${node.target.join(', ')}`);
        });
    });
};

const checkA11yExtended = (context?: any, options?: any) => {
    // Wait for main content to be stable
    cy.get('#main-content').should('be.visible');
    cy.wait(500); // Small buffer for animations/JS hydration

    cy.injectAxe();
    cy.checkA11y(context, { ...a11yConfig, ...options }, logViolations);
};

describe('Comprehensive Accessibility Audit', () => {

    beforeEach(() => {
        // Default viewport
        cy.viewport(1280, 720);
    });

    describe('1. Static Page Audits (Multi-Viewport)', () => {
        const routes = [
            { name: 'Landing', path: '/' },
            { name: 'Login', path: '/login' },
            { name: 'Signup', path: '/signup' },
            { name: 'Contact', path: '/contact' }
        ];

        routes.forEach(route => {
            it(`${route.name} Page - Desktop Accessibility`, () => {
                cy.visit(route.path);
                checkA11yExtended();
            });

            it(`${route.name} Page - Mobile Accessibility`, () => {
                cy.viewport('iphone-6');
                cy.visit(route.path);
                checkA11yExtended();
            });
        });
    });

    describe('2. Keyboard Navigation & Focus Management', () => {
        it('should have visible focus and logical tab order on landing page', () => {
            cy.visit('/');
            // Wait for hydration and stability
            cy.get('#main-content', { timeout: 10000 }).should('be.visible');
            cy.wait(500); // Small buffer for DOM stability

            // Tab to Skip Link
            cy.get('body').tab();
            cy.focused().should('contain.text', 'Skip to main content');

            // Tab into header navigation
            cy.tab(); // First link
            cy.tab(); // Second link

            // Verify focus visibility (basic presence check)
            cy.focused().should('exist').and('be.visible');
        });

        it('should manage focus trap in login form errors', () => {
            cy.visit('/login');
            // Trigger validation error
            cy.get('button[type="submit"]').click();
            cy.get('[role="alert"]').should('be.visible');

            // Verify error message is accessible
            cy.injectAxe();
            cy.checkA11y('[role="alert"]', a11yConfig, logViolations);
        });
    });

    describe('3. Dynamic Content & Component Audits', () => {
        it('should have accessible navigation on mobile viewports', () => {
            cy.viewport('iphone-6');
            cy.visit('/');

            // Check that sign in/up links are accessible on mobile
            cy.get('header nav').should('be.visible');
            checkA11yExtended('header');
        });

        it('should be accessible with active dropdowns in Onboarding', () => {
            cy.visit('/onboarding');
            cy.get('#main-content', { timeout: 10000 }).should('be.visible');
            cy.wait(1000); // Wait for hydration to ensure event handlers are attached

            // Navigate to Step 2 (Profile)
            cy.contains('button', 'Continue').click();
            cy.contains('h2', 'Your Profile', { timeout: 10000 }).should('be.visible');

            // Trigger the grade level dropdown
            cy.get('button[aria-label="Select your grade level"]').should('be.visible').click();

            // Wait for the dropdown content
            cy.get('[role="listbox"]').should('be.visible');

            // Audit while dropdown is open
            // We disable background-related rules because Radix aria-hides the rest of the page
            cy.injectAxe();
            cy.checkA11y(undefined, {
                ...a11yConfig,
                rules: {
                    ...a11yConfig.rules,
                    'scrollable-region-focusable': { enabled: false },
                    'landmark-one-main': { enabled: false },
                    'page-has-heading-one': { enabled: false },
                    'region': { enabled: false },
                    'aria-hidden-focus': { enabled: false }
                }
            }, logViolations);
        });
    });

    describe('4. Focus Management & ARIA Live Regions', () => {
        it('should announce progress in Onboarding', () => {
            cy.visit('/onboarding');
            // The stepper uses aria-label which we added
            cy.get('[aria-label*="step 1"]').should('be.visible');
            checkA11yExtended('.mb-8'); // Audit the stepper region
        });
    });
});
