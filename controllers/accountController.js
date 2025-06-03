const utilities = require('../utilities')
const account = require('../models/account-model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

async function buildAccountManagement(req, res, next) {
    let nav = await utilities.getNav()
    res.render('account/management', {
        title: 'Account Management',
        nav,
        errors: null,
    })
}

async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render('account/login', {
        title: 'Login',
        nav,
        errors: null,
    })
}

async function accountLogout(req, res) {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    })

    res.redirect('/account/login')
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
            nav,
            errors: null,
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

function checkYourCredentials(req, res) {
    req.flash('notice', 'Please check your credentials and try again.')
    res.status(400).render('account/login', {
        title: 'Login',
        nav,
        errors: null,
        email,
    })
}

async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const {email, password} = req.body
    const accountData = await account.getAccountByEmail(email)
    if (!accountData) {
        checkYourCredentials(req, res)
        return
    }
    try {
        if (await bcrypt.compare(password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.JWT_SECRET, {expiresIn: 3600*1000})
            if(process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect('/account/')
        } else {
            checkYourCredentials(req, res)
        }
    } catch (error) {
        return new Error('Access Forbidden')
    }
}

async function buildUpdateAccount(req, res) {
    let nav = await utilities.getNav()
    const accountId = parseInt(req.params.accountId)
    const found = await account.getAccountById(accountId)
    res.render('account/update', {
        title: `Edit ${found.account_firstname} ${found.account_lastname}`,
        nav,
        errors: null,
        id: found.account_id,
        firstName: found.account_firstname,
        lastName: found.account_lastname,
        email: found.account_email,
    })
}

module.exports = {buildLogin, buildRegister, register, accountLogin, accountLogout, buildAccountManagement, buildUpdateAccount}