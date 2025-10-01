const utilities = require(".")
const { body, validationResult } = require("express-validator") //we use the first tool to access the data and the second to retrieve any errors.
const validate = {}
const accountModel = require("../models/account-model")


/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim() //is a sanitizing function used to remove whitespace
      .escape() //finds any special character and transform it to an HTML Entity 
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => { //Creates a custom check and passes account_email variable as parameter
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
            throw new Error("Email already in use. Please log in or use a different email address")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim() 
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/*  **********************************
  *  Log in  Data Validation Rules
  * ********************************* */
  validate.LoginRules = () => {
    return [
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim() //is a sanitizing function used to remove whitespace
      .escape() //finds any special character and transform it to an HTML Entity 
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
  
      // password is required and must be strong password
      body("account_password")
        .trim() 
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Wrong Password."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to Log in
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

/* **************************************
* Checks if the account type is admin or employee and deliver the page accordingly
********************************************************* */
validate.checkAccountType = (req, res, next) => {
  const accountType = res.locals.accountData?.account_type;

  if (["Admin", "Employee"].includes(accountType)) {
    return next();
  }

  req.flash("notice", "Access denied. Admins or Employees only.");
  return res.redirect("/account/login");
};

/*  **********************************
  *  account update Data Validation Rules
  * ********************************* */
  validate.accountUpdateRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim() //is a sanitizing function used to remove whitespace
      .escape() //finds any special character and transform it to an HTML Entity 
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const existingAccount = await accountModel.getAccountByEmail(account_email);
        if (existingAccount && existingAccount.account_id !== parseInt(req.body.account_id, 10)) {
          throw new Error("Email already in use. Please use a different email address.");
        }
      }),
    ]
  }

  validate.passwordUpdateRule = () => {
  return [
    body("account_password")
      .optional({ checkFalsy: true }) //allows empty or missing password
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update-account", {
      errors,
      title: "Update" + account_firstname,
      nav,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

module.exports = validate