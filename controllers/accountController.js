const utilities = require('../utilities/')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")


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


module.exports = {buildAccountView, buildRegister, registerAccount} // Exports an object not the function