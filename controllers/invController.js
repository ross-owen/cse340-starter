const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build item by inventory id view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
    const id = req.params.id
    const vehicle = await invModel.getInventoryById(id)
    if (!vehicle) {
        return res.status(404).render("./inventory/not-found", {})
    }
    const detail = await utilities.buildByInventoryId(vehicle)
    let nav = await utilities.getNav()
    res.render("./inventory/item", {
        title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
        nav,
        detail: detail,
    })
}

module.exports = invCont
