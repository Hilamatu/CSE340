const { resolveInclude } = require('ejs');
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

/* **************************************
Return Inventory by Classification As JSON
**************************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildInventoryEditView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id) //Collect and store the incoming inventory_id as an integer
  let nav = await utilities.getNav()
  const itemDataArray = await invModel.getInventoryDetailByInvID(inv_id) //call the model-based function to get all the inventory item data adn pass it to classificationSelect. It will return an array
  const itemData = itemDataArray[0]// Extract the first item fromteh array
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id) //Builds the classification list using the itemData
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`//From the returned data, create a "name" variable to hold the Make and Model
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


module.exports = invCont;