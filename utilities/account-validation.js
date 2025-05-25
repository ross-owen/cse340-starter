const utilities = require('.')
const {body, validationResult} = require('express-validator')
const validator = {}

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
            .withMessage('Please provide a valid email address'),
        body('password')
            .trim()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumber: 1,
                minSymbols: 1
            })
            .normalizeEmail()
            .withMessage('Please provide a valid password that meets the specified requirements'),
    ]
}

validator.checkData = async (req, res, next) => {
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

module.exports = validator