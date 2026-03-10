import './commands'
import 'cypress-axe'
import 'cypress-plugin-tab'

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from failing the test
    if (
        err.message.includes('Hydration failed') ||
        err.message.includes('Minified React error #418') ||
        err.message.includes('Minified React error #423')
    ) {
        return false
    }
    // we still want to ensure other errors fail our tests
    return true
})
