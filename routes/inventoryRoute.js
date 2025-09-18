//Needed resources
const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController')
const utilities = require('../utilities/')
const errorController = require('../controllers/errorController')

//Route to build inventory management view
router.get('/management', utilities.handleErrors(invController.buildManagementView));

//Route to build inventory by classification view
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));

//details route
router.get('/detail/:invId', utilities.handleErrors(invController.buildByInvIdView));

// Error Trigger Route
router.get('/error', utilities.handleErrors(errorController.triggerError));

module.exports = router;