const express = require('express');
const router = express.Router(); //Express "router" functionality is invoked and stored into a local variable for use. Notice the (), indicating that Router is a function.

// Static Routes
// Set up "public" folder / subfolders for static files
router.use(express.static("public"));
router.use("/css", express.static(__dirname + "public/css"));
//Indicates that any route that contains /css, js/, /image is to refer to the public/ folder, which is found at the root level of the project.
router.use("/js", express.static(__dirname + "public/js"));
router.use("/images", express.static(__dirname + "public/images"));

module.exports = router;



