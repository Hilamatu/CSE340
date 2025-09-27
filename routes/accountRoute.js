// Needed resources
const express = require('express')
const router = new express.Router()
const accountController = require ('../controllers/accountController')
const utilities = require('../utilities/')
const regValidate = require('../utilities/account-validation')

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
  (req, res) => {
    res.status(200).send('login process')
  });


module.exports = router;