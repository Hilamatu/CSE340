// Needed resources
const express = require('express')
const router = new express.Router()
const accountController = require ('../controllers/accountController')
const utilities = require('../utilities/')
const regValidate = require('../utilities/account-validation')
const validate = require('../utilities/account-validation')

/* *************************************
 "GET" route for the path that will be sent when the "My Account" link is clicked.
 Only the part of the path that follows "account". the path will be placed in server.js
 ************************************** */
router.get('/login', utilities.handleErrors(accountController.buildAccountView));

// Route for registration page
router.get('/register', utilities.handleErrors(accountController.buildRegister));

//Route to look within the post object
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidate.LoginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin));

//Route for the sucessed login view
router.get('/', utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagementView))

router.get("/logout", (req, res) => {
  // Destroy session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err)
    }
    // Clear JWT cookie
    res.clearCookie("jwt")   // match the name used in utilities.checkJWTToken
    res.redirect("/")        // send user back to home
  })
})

//Route to update the account information
router.get('/update/:account_id', utilities.handleErrors(accountController.buildUpdateAccountView))

//Route to handle the incoming request from the form to update the account
router.post("/update/",
  regValidate.accountUpdateRules(),
  regValidate.passwordUpdateRule(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

router.post("/update-password/", 
  validate.passwordUpdateRule(),
  utilities.handleErrors(accountController.passwordUpdate)
)

module.exports = router;