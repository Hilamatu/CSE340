//Needed resources
const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController')
const utilities = require('../utilities/')
const errorController = require('../controllers/errorController')
const managementController = require('../controllers/managementController')

//Route to build inventory management view
router.get('/management', utilities.handleErrors(invController.buildManagementView));

//Route to build inventory by classification view
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));

//details route
router.get('/detail/:invId', utilities.handleErrors(invController.buildByInvIdView));

//Add management view route
router.get('/', utilities.handleErrors(managementController.buildMgmtView))

//Add classification route
router.get('/add-classification', utilities.handleErrors(managementController.buildAddClassification))

//Post the add-classification
router.post('/add-classification', utilities.handleErrors(managementController.addClassification))

//Add inventory route
router.get('/add-inventory', utilities.handleErrors(managementController.buildAddInventory))

//Post the add-inventory
router.post('/add-inventory', utilities.handleErrors(managementController.addInventory))

// Error Trigger Route
router.get('/error', utilities.handleErrors(errorController.triggerError));

module.exports = router;