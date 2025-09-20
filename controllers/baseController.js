const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  //req.flash("Notice", "This is a flash message.") // the first paramater indicates the type of the message. This will be added as a class to <ul>
  res.render("index", {title: "Home", nav})
}

module.exports = baseController 