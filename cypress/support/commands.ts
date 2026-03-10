// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
// ***********************************************

Cypress.Commands.add('login', (email, password) => {
    cy.visit('/login')
    cy.wait(1000)

    cy.get('#login-email').should('be.visible').type(email, { delay: 50, force: true })
    cy.contains('button', 'Continue').click()
    cy.wait(500)

    if (password) {
        cy.get('#login-password').should('be.visible').type(password, { delay: 50, force: true })
        cy.contains('button', 'Sign In').click()
        cy.wait(1000)
    }
})

Cypress.Commands.add('loginLearner', (email, patternArray) => {
    // Visit first to set origin
    cy.visit('/')
    cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: { email, pattern: patternArray }
    }).then((resp) => {
        expect(resp.status).to.eq(200);
        cy.window().then((win) => {
            win.localStorage.setItem('token', resp.body.token);
        });
    });
})

Cypress.Commands.add('loginParent', (email, password) => {
    // Visit first to set origin
    cy.visit('/')
    cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: { email, password }
    }).then((resp) => {
        expect(resp.status).to.eq(200);
        cy.window().then((win) => {
            win.localStorage.setItem('token', resp.body.token);
        });
    });
})

declare global {
    namespace Cypress {
        interface Chainable {
            login(email: string, password?: string): Chainable<Element>
            loginLearner(email: string, patternArray: number[]): Chainable<Element>
            loginParent(email: string, password?: string): Chainable<Element>
        }
    }
}

export { }
