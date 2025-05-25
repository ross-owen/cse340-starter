const utilities = require('../utilities')
const account = require('../models/account-model')

async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render('account/login', {
        title: 'Login',
        nav,
    })
}

async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render('account/register', {
        title: 'Register',
        nav,
        errors: null,
    })
}

async function register(req, res) {
    let nav = await utilities.getNav()
    const {
        firstName,
        lastName,
        email,
        password
    } = req.body

    const result = await account.registerAccount(
        firstName,
        lastName,
        email,
        password,
    )

    if (result) {
        req.flash('notice', `Congratulations, you're registered ${firstName}. Please log in.`)
        res.status(201).render('account/login', {
            title: 'Login',
            nav
        })
    } else {
        req.flash('notice', 'Sorry, the registration failed.')
        res.status(501).render('account/register', {
            title: 'Register',
            nav,
            errors: null,
        })
    }
}

module.exports = {buildLogin, buildRegister, register}