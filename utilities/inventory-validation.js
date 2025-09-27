const utilities = require(".")
const { body, validationResult } = require("express-validator") //we use the first tool to access the data and the second to retrieve any errors.
const validate = {}
const addModel = require("../models/add-model")
const classificationList = require ("./index")


/*  **********************************
  *  Clasification Data Validation rule
  * ********************************* */
  validate.classificationRule = () => {
    return [
      // classification name is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide classification Name. Only alphabetic characters allowed") // on error this message is sent.
        .custom(async (classification_name) => { //Creates a custom check and passes classification_name variable as parameter
        const emailExists = await addModel.checkExistingClassification(classification_name)
        if (emailExists) {
            throw new Error("Classification already created. Please use a different name.")
        }
      })
    ]
  }


/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
};

/*  **********************************
  *  Add inventopry Data Validation Rules
  * ********************************* */
  validate.addInventoryRule = () => {
    return [
      // Classification is required and must be selected
      body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .isInt({ min : 1})
        .withMessage("Please select the classification to add the inventory"), // on error this message is sent.
  
      // Make is required and must be string
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .isAlphanumeric()
        .withMessage("Please provide a make."), // on error this message is sent.
  
      // Model is required 
      body("inv_model")
      .trim() 
      .escape() 
      .notEmpty()
      .isLength({min : 3})
      .isAlphanumeric()
      .withMessage("Please provide a model"),

      // Inventory year is required and should be a 4 digits number
      body("inv_year")
        .trim() 
        .notEmpty()
        .isNumeric({min : 1500})
        .isInt()
        .isLength({max: 4})
        .withMessage("Enter the vehicle year"),

      body("inv_description")
        .trim() 
        .escape() 
        .notEmpty()
        .withMessage("Please provide a description"),

      body("inv_image")
        .trim()
        .notEmpty()
        .withMessage("Please provide a valid image path"),

      body("inv_thumbnail")
        .trim()
        .notEmpty()
        .withMessage("Please provide a valid thumbnail path"),
    
      body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .isInt({mnin : 0})
        .withMessage("Please provide a valid price. Only digits"),

      body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .isInt({min:0})
        .withMessage("Please provide a valid mileage. Only numbers."),
    
      body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isAlpha()
        .withMessage("Please provide a valid color."),

    ]
  }


/* ******************************
 * Check data and return errors or continue to add the inventory
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    let classificationList = await utilities.buildClassificationList()
  const { 
    classification_id, 
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-inventory", {
      errors,
      title: "Add inventory",
      nav,
      classificationList,
      classification_id, 
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color
    })
    return
  }
  next()
}

module.exports = validate