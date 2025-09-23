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

module.exports = {addClassification}