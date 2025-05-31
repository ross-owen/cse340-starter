const pool = require('../database/')

async function registerAccount(firstName, lastName, email, password) {
    try {
        const sql = `
            INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
            VALUES ($1, $2, $3, $4, 'Client')
            RETURNING *`
        return await pool.query(sql, [firstName, lastName, email, password])
    } catch (error) {
        return error.message
    }
}

async function login(email, password) {
    console.log(password)
    try {
        const sql = `
            SELECT *
            FROM account
            WHERE account_email = $1
              AND account_password = $2`
        const result = await pool.query(sql, [email, password])
        return result[0]
    } catch (error) {
        return error.message
    }
}

async function checkExistingEmail(email) {
    try {
        const sql = `
            SELECT *
            FROM account
            WHERE account_email = $1`
        const result = await pool.query(sql, [email])
        return result.rowCount
    } catch (error) {
        return error.message
    }
}

async function getAccountByEmail(email) {
    try {
        const result = await pool.query(
            `SELECT *
             FROM account
             WHERE account_email = $1`,
            [email])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}

module.exports = {registerAccount, checkExistingEmail, login, getAccountByEmail}