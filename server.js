/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const expressLayouts = require("express-ejs-layouts") 
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require ('./utilities/')
const session = require("express-session")
const pool = require('./database/')
const accountController = require('./routes/accountRoute')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser") //require the cookie parser that was installed

/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  /* indicates a "secret" name - value pair 
  that will be used to protect the session. We will create the value of the secret in the .env file
   */
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Make session data available to all views
app.use((req, res, next) => {
  res.locals.loggedin = req.session.loggedin || false
  res.locals.accountData = req.session.accountData || {}
  next()
})

// Express messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res,next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(cookieParser())// allows the cookie parser to be implemented throughout the project

app.use(utilities.checkJWTToken)// Universal piece of middleware to validate the token if present and if not, just move to the next

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs") //declare that ejs will be the view engine for our application
app.use(expressLayouts) //tells the application to use the express-ejs-layouts package
app.set("layout", "./layouts/layout") // not at views root when the express ejs layout goes 
/************************************** looking for the basic template for a view, it will find it in a layouts folder, and the template will be named layout.


/* ***********************
 * Routes. use.app is an express function that tells the server to use a specific route.
 *************************/
app.use(static)

//index route
/* "/" - This is route being watched. It indicates the base route of the application or the route which has no specific resource requested.
*/
// Wraps the buildHome function in the error handling middleware
app.get("/", utilities.handleErrors(baseController.buildHome));
// Inventory routes
app.use('/inv', inventoryRoute);
// My account route. All paths in accountRoute.js are prefixed with /account already
app.use('/account', accountController);
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
});

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} 
  else {
    message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

