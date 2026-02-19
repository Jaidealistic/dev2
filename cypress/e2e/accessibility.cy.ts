// Defines the structure of axe accessibility violations
interface AxeViolation {
    id: string;
    impact?: string | null;
    description: string;
    nodes: any[];
}

// Logs accessibility violations to the Cypress terminal
function terminalLog(violations: AxeViolation[]) {
    cy.task(
        'log',
        `${violations.length} accessibility violation${violations.length === 1 ? '' : 's'} 
        ${violations.length === 1 ? 'was' : 'were'} detected`
    );

    // Formats violation data for readable output
    const violationData = violations.map(
        ({ id, impact, description, nodes }: AxeViolation) => ({
            id,
            impact,
            description,
            nodes: nodes.length
        })
    );

    cy.task('table', violationData);
}

// Runs accessibility tests on key application pages
describe('Accessibility Tests', () => {

    // Checks accessibility of the home page
    it('should pass accessibility checks on the homepage', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.checkA11y(undefined, { includedImpacts: ['critical', 'serious'] }, terminalLog);
    });

    // Checks accessibility of the login page
    it('should pass accessibility checks on the login page', () => {
        cy.visit('/login');
        cy.injectAxe();
        cy.checkA11y(undefined, { includedImpacts: ['critical', 'serious'] }, terminalLog);
    });

    // Checks accessibility of the signup page
    it('should pass accessibility checks on the signup page', () => {
        cy.visit('/signup');
        cy.injectAxe();
        cy.checkA11y(undefined, { includedImpacts: ['critical', 'serious'] }, terminalLog);
    });
});
