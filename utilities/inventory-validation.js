const utilities = require('.')
const {body, validationResult} = require('express-validator')
const validator = {}
const invModel = require('../models/inventory-model')

validator.classificationRules = () => {
    return [
        body('classificationName')
            .trim()
            .isString()
            .isLength({min: 1})
            .withMessage('Please provide a classification name')
            .custom(async(name) => {
                const exists = await invModel.checkClassificationExists(name)
                if (exists) {
                    throw new Error('Classification already exists')
                }
            }),
    ]
}

validator.classificationDataCheck = async (req, res, next) => {
    const {
        classificationName,
    } = req.body

    let errors = []
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render('inventory/add-classification', {
            errors,
            title: 'Add Classification',
            nav,
            classificationName,
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