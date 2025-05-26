const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
                  JOIN public.classification AS c 
                  ON i.classification_id = c.classification_id 
                  WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}

/* ***************************
 *  Get all inventory item by id
 * ************************** */
async function getInventoryById(id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
                  WHERE i.inv_id = $1`,
            [id]
        )
        return data.rows[0];
    } catch (error) {
        console.error("getbyid error " + error)
    }
}

async function checkClassificationExists(name) {
    try {
        const sql = `
        SELECT * FROM classification WHERE classification_name = $1`
        const result = await pool.query(sql, [name])
        return result.rowCount
    } catch (error) {
        return error.message
    }
}

async function addClassification(name) {
    try {
        const sql = `
        INSERT INTO classification (classification_name)
        VALUES ($1) 
        RETURNING *`
        return await pool.query(sql, [name])
    } catch (error) {
        return error.message
    }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById, checkClassificationExists, addClassification}