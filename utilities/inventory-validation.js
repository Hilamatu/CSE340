const utilities = require(".")
const { body, validationResult } = require("express-validator") //we use the first tool to access the data and the second to retrieve any errors.
const validate = {}
const addModel = require("../models/add-model")


/*  **********************************
  *  Clasification Data Validation rule
  * ********************************* */
  validate.classificationRule = () => {
    return [
      // firstname is required and must be string
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
 * Check data and return errors or continue to registration
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

module.exports = validate