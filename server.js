/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const expressLayouts = require("espress-ejs-layouts") 
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs") //declare that ejs will be the view engine for our application
app.use(expressLayouts) //tells the application to use the express-ejs-layouts package
app.set("layout", "./layouts/layout") // not at views root when the express ejs layout goes 
/************************************** looking for the basic template for a view, it will find it in a layouts folder, and the template will be named layout.


/* ***********************
 * Routes
 *************************/
app.use(static)

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
