const pool = require('../database')

/* ******************************************
Add new Classification
******************************************* */
async function addClassification(classification_name){
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        return await pool.query(sql, [classification_name])
    } catch(error) {
        return error.message
    }
}

//Add new inventory query
async function addInventory(classification_id, inv_make, inv_model, inv_year, inv_image, inv_description, inv_thumbnail, inv_price, inv_miles, inv_color){
    try {
        const sql = "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_year, inv_image, inv_description, inv_thumbnail, inv_price, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
        return await pool.query(sql, [classification_id, inv_make, inv_model, inv_year, inv_image, inv_description, inv_thumbnail, inv_price, inv_miles, inv_color])
    } catch(error) {
        return error.message
    }
}

/* *************************************
Checking for existing classifications
************************************** */
async function checkExistingClassification(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const email = await pool.query(sql, [classification_name])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

module.exports = {addClassification, addInventory, checkExistingClassification}