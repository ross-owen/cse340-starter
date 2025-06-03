const express = require('express')
const router = new express.Router()
const controller = require('../controllers/accountController')
const utilities = require('../utilities')
const validator = require('../utilities/account-validation')

router.get('/', utilities.checkLogin, utilities.handleErrors(controller.buildAccountManagement))
router.get('/login', utilities.handleErrors(controller.buildLogin))
router.get('/logout', utilities.handleErrors(controller.accountLogout))
router.get('/register', utilities.handleErrors(controller.buildRegister))
router.post(
    '/register',
    validator.registrationRules(),
    validator.registrationDataCheck,
    utilities.handleErrors(controller.register)
)
router.post(
    '/login',
    validator.loginRules(),
    validator.loginDataCheck,
    utilities.handleErrors(controller.accountLogin)
)
router.get('/update/:accountId', utilities.handleErrors(controller.buildUpdateAccount))

module.exports = router
