const utilities = require('../utilities')
const account = require('../models/account-model')
const bcrypt = require('bcryptjs')

async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render('account/login', {
        title: 'Login',
        nav,
        errors: null,
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

    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(password, 10)
    } catch (error) {
        req.flash('notice', 'Sorry, there was an error processing the registration')
        res.status(500).render('account/register', {
            title: 'Register',
            nav,
            errors: null,
        })
    }

    const result = await account.registerAccount(
        firstName,
        lastName,
        email,
        hashedPassword,
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

async function login(req, res) {
    let nav = await utilities.getNav()
    const {
        email,
        password
    } = req.body

    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(password, 10)
    } catch (error) {
        req.flash('notice', 'Sorry, there was an error processing the login')
        res.status(500).render('account/login', {
            title: 'Login',
            nav,
            errors: null,
        })
    }
    const result = await account.login(email, hashedPassword)

    if (result) {
        req.flash('notice', `Welcome back ${firstName}.`)
        res.status(201).render('account/login', {
            title: 'Login',
            nav,
            errors: null,
        })
    } else {
        req.flash('notice', 'Invalid login.')
        res.status(400).render('account/login', {
            title: 'Login',
            nav,
            errors: null,
        })
    }
}

module.exports = {buildLogin, buildRegister, register, login}