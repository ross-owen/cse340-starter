const express = require('express')
const router = new express.Router()
const accountController = require('../controllers/accountController')
const utilities = require('../utilities')
const validator = require('../utilities/account-validation')

router.get('/login', utilities.handleErrors(accountController.buildLogin))
router.get('/register', utilities.handleErrors(accountController.buildRegister))
router.post(
    '/register',
    validator.registrationRules(),
    validator.checkData,
    utilities.handleErrors(accountController.register)
)

module.exports = router
