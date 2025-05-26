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
        const error = new Error("I'm sorry! I could not find that vehicle. Are you trying to hack me? I will find you and your mother if you are.")
        error.status = 404;
        return next(error)
    }
    const detail = await utilities.buildByInventoryId(vehicle)
    let nav = await utilities.getNav()
    res.render("./inventory/item", {
        title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
        nav,
        detail: detail,
    })
}

invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: 'Inventory Management',
        nav,
        errors: null,
    })
}

invCont.buildNewClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: 'Add Classification',
        nav,
        errors: null,
    })
}

invCont.addClassification = async function (req, res) {
    const {
        classificationName,
    } = req.body

    const result = await invModel.addClassification(classificationName)
    let nav = await utilities.getNav()

    if (result) {
        req.flash('notice', `Classification ${classificationName} has been added successfully.`)
        res.status(201).render('inventory/add-classification', {
            title: 'Add Classification',
            nav,
            errors: null,
        })
    } else {
        req.flash('notice', 'Failed to create the classification.')
        res.status(501).render('inventory/add-classification', {
            title: 'Add Classification',
            nav,
            errors: null,
        })
    }
}

invCont.addVehicle = async function (req, res) {
    const {
        year,
        make,
        model,
        description,
        image,
        thumbnail,
        price,
        miles,
        color,
        classificationId,
    } = req.body

    const result = await invModel.addVehicle(
        year,
        make,
        model,
        description,
        image,
        thumbnail,
        price,
        miles,
        color,
        classificationId,
    )

    let nav = await utilities.getNav()
    let classifications = await utilities.buildClassificationList()

    console.log(`Ross was here: ${classifications}`)

    if (result) {
        req.flash('notice', `${year} ${make} ${model} has been added successfully`)
        res.status(201).render('inventory/add-inventory', {
            title: 'Add Vehicle',
            nav,
            classifications,
            errors: null,
        })
    } else {
        req.flash('notice', 'Failed to create the vehicle')
        res.status(501).render('inventory/add-inventory', {
            title: 'Add Vehicle',
            nav,
            classifications,
            errors: null,
        })
    }
}

invCont.buildNewVehicle = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classifications = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
        title: 'Add Vehicle',
        nav,
        classifications,
        errors: null,
    })
}

invCont.buildServerError = function (req, res, next) {
    throw new Error("I'm sorry Dave. I just can't let you do that.")
}

module.exports = invCont
