const pool = require("../db")
//Adds an address to the database 
const createAddress = async (request, response) => {
    const { address } = request.body
    const sid = request.sessionID
    try {
        await pool.query('DELETE FROM basic_address WHERE sid = $1', [sid])
        await pool.query('INSERT INTO basic_address (address, sid) VALUES ($1, $2)', [address, sid])
        response.status(201).json({ "msg": "basic added" })

    } catch (error) {
        response.status(500).json({ "msg": "Database error", "error": error })
    }
}
//Returns an address based on the users SID
const getAddress = (request, response) => {
    const sid = request.sessionID
    pool.query('SELECT * FROM basic_address WHERE sid= $1', [sid], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount == 0) {
            response.status(404).json({ "msg": "not found" })
        } else {
            response.status(200).json({ "msg": "succesfully retrieved", "address": results.rows[0].address })
        }
    })
}
/*
const deleteAddress = (request, response) => {
    const sid = request.sessionID
    pool.query('DELETE FROM contacts WHERE sid = $1', [sid], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": `Contact with ID: ${id} not found` })
        } else {
            response.status(200).json({ "msg": `Contact deleted with ID: ${id}` })
        }

    })
}
    */
module.exports = { createAddress, getAddress }