const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

const invCont = {};
// Create the object to hold the detail view

/* *************************
* Build inventory by classification view
* ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render('./inventory/classification', {
        title: className + 'vehicles',
        nav,
        grid,
        errors: null,
    });
}


/* **********************************************
*Build the details view by Inventory Id inv_id
************************************************* */
invCont.buildByInvIdView = async function (req, res, next) {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryDetailByInvID(inv_id)
    const grid = await utilities.buildDetailView(data)
    let nav = await utilities.getNav()
    const invMake = data[0].inv_make
    const invModelName = data[0].inv_model
    const invYear = data[0].inv_year
    res.render('./inventory/inv-detail', {
        title: invYear + ' ' + invMake + ' ' + invModelName,
        nav,
        grid,
        errors: null,
    });
}

module.exports = invCont;