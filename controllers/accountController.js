const utilities = require('../utilities/')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
Deliver Log in View
**************************************** */
async function buildAccountView(req, res, next){
    let nav = await utilities.getNav()
    //Render the view. The view should be inside the view folder
    res.render('account/login', {
        title: 'Login',
        nav,
        errors: null,
    })
}

// Build registration view
async function buildRegister(req, res, next_){
    let nav = await utilities.getNav()
    res.render('account/register', {
    title: 'Register',
    nav,
    errors: null,
})
}

//process the incoming data
/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10) // 10 is the saltRound indicating how many times a hash will be resent through the hashing algorithm
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}


/* ***********************************************
Process Login request
****************************************** */
async function accountLogin (req, res){
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body //collects the incoming data from teh request body
  const accountData = await accountModel.getAccountByEmail(account_email) //If any data returned, will be stored in the accountData
  if (!accountData) {
    req.flash("notice", "Check your credentials and try again.")
    res.status(400).render("account/login" , {
      title: "Login",
      nav,
      errors:null,
      account_email,
    })
    return
  }
  try {
    //This try block will use the bcrypt.compre() to compare if the incoming password matches the hashed password from the DB(It will hash the password first using the same alg.)
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password //JS to delete the hashed password from the accountData array.
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 }) //JWT created. secrete read from env. file.
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 }) // http only so client side JS cannot access it
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })  // Passed only through a HTTPS
      }
      return res.redirect("/account/") //Deliver the account management view
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

//Build Logged in  view
async function buildAccountManagementView(req, res, next_){
    let nav = await utilities.getNav()
    res.render('account/loggedIn', {
    title: 'You are Logged In',
    nav,
    errors: null,
    })
  }

module.exports = {buildAccountView, buildRegister, registerAccount, accountLogin, buildAccountManagementView} // Exports an object not the function