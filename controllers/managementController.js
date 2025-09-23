const utilities = require('../utilities/')
const addClassificationModel = require('../models/add-model')

async function buildMgmtView (req, res, next){
    let nav = await utilities.getNav()
    res.render('inventory/management', {
        title: 'Inventory Management Page',
        nav
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

async function addClassification(req, res) {
  
  const { classification_name } = req.body

  const regResult = await addClassificationModel.addClassification(
    classification_name
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${classification_name}.`
    )
    let nav = await utilities.getNav()
    res.status(201).render("inventory/add-classification", {
      title: "Add Classification success",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    let nav = await utilities.getNav()
    
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
  }
}


module.exports = {buildMgmtView, buildAddClassification, addClassification}