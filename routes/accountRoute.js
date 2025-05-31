const express = require('express')
const router = new express.Router()
const accountController = require('../controllers/accountController')
const utilities = require('../utilities')
const validator = require('../utilities/account-validation')

router.get('/', utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))
router.get('/login', utilities.handleErrors(accountController.buildLogin))
router.get('/logout', utilities.handleErrors(accountController.accountLogout))
router.get('/register', utilities.handleErrors(accountController.buildRegister))
router.post(
    '/register',
    validator.registrationRules(),
    validator.registrationDataCheck,
    utilities.handleErrors(accountController.register)
)
router.post(
    '/login',
    validator.loginRules(),
    validator.loginDataCheck,
    utilities.handleErrors(accountController.accountLogin)
)

module.exports = router
