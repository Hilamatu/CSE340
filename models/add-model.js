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

//Query for updating the inventory
async function updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,){
    try {
        const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
        //Variables order should match the sql placeholder and also the order in the controller
        const data = await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id])
        return data.rows[0]
    } catch(error) {
        return error.message
    }
}

async function deleteInventory(inv_id){
    try{
        const sql = "DELETE FROM public.inventory WHERE inv_id = $1"
        const data = await pool.query(sql, [inv_id])
        return data
    } catch(error) {
        return error.message
    }
    }

module.exports = {addClassification, addInventory, checkExistingClassification, updateInventory, deleteInventory}