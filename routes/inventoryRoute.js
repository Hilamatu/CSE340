//Needed resources
const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController')
const utilities = require('../utilities/')
const errorController = require('../controllers/errorController')
const managementController = require('../controllers/managementController')
const invValidate = require("../utilities/inventory-validation")
const accountValidate = require("../utilities/account-validation")

//Route to build inventory management view
router.get('/management', 
    utilities.checkLogin,
    accountValidate.checkAccountType, // Just pass the middleware function to mnake sure it doesn't run immediatelly 
    utilities.handleErrors(invController.buildManagementView));

//Route to build inventory by classification view
router.get('/type/:classificationId', 
    utilities.handleErrors(invController.buildByClassificationId));

//details route
router.get('/detail/:invId', utilities.handleErrors(invController.buildByInvIdView));

//Add management view route
router.get('/', 
    utilities.checkLogin,
    accountValidate.checkAccountType, utilities.handleErrors(managementController.buildMgmtView))

//Add classification route
router.get('/add-classification', 
    utilities.checkLogin,
    accountValidate.checkAccountType,
    utilities.handleErrors(managementController.buildAddClassification))

//Post the add-classification
router.post('/add-classification', 
    invValidate.classificationRule(),
      invValidate.checkClassificationData,
      utilities.handleErrors(managementController.addClassification))

//Add inventory route
router.get('/add-inventory', 
    utilities.checkLogin,
    accountValidate.checkAccountType,
    utilities.handleErrors(managementController.buildAddInventory))

//Post the add-inventory
router.post('/add-inventory', 
    invValidate.addInventoryRule(),
        invValidate.checkInventoryData,
        utilities.handleErrors(managementController.addInventory));

//Route to display the inventory after selecting the classification
router.get('/getInventory/:classification_id', utilities.handleErrors(invController.getInventoryJSON))

//Rout to build the inventory edit view
router.get('/edit/:inv_id', 
    utilities.checkLogin,
    accountValidate.checkAccountType,
    utilities.handleErrors(invController.buildInventoryEditView))

//Route to handle the incoming request from the form
router.post("/update/", 
    invValidate.addInventoryRule(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

// Route to delete inventory. (Path was defined on the /public/js/inventory.js)
router.get('/delete/:inv_id', 
    utilities.checkLogin,
    accountValidate.checkAccountType,
    utilities.handleErrors(invController.deleteInventoryView))

//Route to handle the incoming request to delete inventory
router.post('/delete/', utilities.handleErrors(invController.deleteInventory))

// Error Trigger Route
router.get('/error', utilities.handleErrors(errorController.triggerError));



module.exports = router;