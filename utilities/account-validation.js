const utilities = require('.')
const {body, validationResult} = require('express-validator')
const validator = {}
const accountModel = require('../models/account-model')

validator.registrationRules = () => {
    return [
        body('firstName')
            .trim()
            .isString()
            .isLength({min: 1})
            .withMessage('Please provide a first name'),
        body('lastName')
            .trim()
            .isString()
            .isLength({min: 1})
            .withMessage('Please provide a last name'),
        body('email')
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email address')
            .custom(async (email) => {
                const emailExists = await accountModel.checkExistingEmail(email)
                if (emailExists) {
                    throw new Error('Email address already exists. Please log in or register with a different email address')
                }
            }),
        body('password')
            .trim()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumber: 1,
                minSymbols: 1
            })
            .withMessage('Please provide a valid password that meets the specified requirements'),
    ]
}

validator.registrationDataCheck = async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
    } = req.body

    let errors = []
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render('account/register', {
            errors,
            title: 'Register',
            nav,
            firstName,
            lastName,
            email,
        })
        return
    }
    next()
}

validator.loginRules = () => {
    return [
        body('email')
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email address'),
        body('password')
            .trim()
            .isLength({min: 1})
            .withMessage('Please provide a password'),
    ]
}

validator.loginDataCheck = async (req, res, next) => {
    const {
        email,
        password,
    } = req.body

    let errors = []
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render('account/login', {
            errors,
            title: 'Login',
            nav,
            email,
            password,
        })
        return
    }
    next()
}

module.exports = validator