const utilities = require('../utilities/')
const addClassificationModel = require('../models/add-model')

async function buildMgmtView (req, res, next){
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    const accountData = res.locals.accountData;
    res.render('inventory/management', {
        title: 'Inventory Management Page',
        nav,
        classificationSelect,
        accountData,
        errors: null,
        
    })
}

// Build add-classification view
async function buildAddClassification(req, res, next_){
    let nav = await utilities.getNav()
    res.render('inventory/add-classification', {
    title: 'Add Classification',
    nav,
    errors: null
})
}

//Function that will import the query from Models to add classification
async function addClassification(req, res) {
  const classificationSelect = await utilities.buildClassificationList()
  const { classification_name } = req.body

  const regResult = await addClassificationModel.addClassification(
    classification_name
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve registered ${classification_name}.`
    )
    let nav = await utilities.getNav()
    res.status(201).render("inventory/management", {
      title: "Add Classification success",
      nav,
      classificationSelect,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    let nav = await utilities.getNav()

    res.status(501).render("inventory/management", {
      title: "Add Classification",
      nav,
      classificationSelect,
      errors: null,
    })
  }
}

// Build add-inventory view
async function buildAddInventory(req, res, next_){
    const classificationSelect = await utilities.buildClassificationList()
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList() //Call the buildClassificationList to have the drop down reflect the current nav
    res.render('inventory/add-inventory', {
    title: 'Add inventory',
    nav,
    classificationList,
    classificationSelect,
    errors: null,
})
}

//Function that will import the query to add inventory
async function addInventory(req, res) {
  const classificationSelect = await utilities.buildClassificationList()
  const { classification_id, inv_make, inv_model, inv_year, inv_image, inv_description, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body

  const regResult = await addClassificationModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_image,
    inv_description,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color

  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, inventory added for  ${inv_make}.`
    )
    let nav = await utilities.getNav()
    res.status(201).render("inventory/management", {
      title: "Add inventory success",
      nav,
      classificationSelect,
      errors:null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    let nav = await utilities.getNav()
    
    res.status(501).render("inventory/management", {
      title: "Add Inventory",
      nav,
      classificationSelect,
      errors: null,
    })
  }
}


module.exports = {buildMgmtView, buildAddClassification, addClassification, buildAddInventory, addInventory}