const pool = require("../db")

//Adds an address to the database 
const createAddress = async (request, response) => {

    const { address } = request.body
    const sid = request.sessionID
    if (!sid) {
        return response.status(401).json({ "msg": "No authorised no sid " })

    }
    try {
        const number = await pool.query('SELECT * FROM basic_address WHERE sid= $1', [sid])
        if (number.rows.length > 0) {
            await pool.query('DELETE FROM basic_address WHERE sid = $1', [sid])
        }
        await pool.query('INSERT INTO basic_address (address, sid) VALUES ($1, $2)', [address, sid])
        response.status(201).json({ "msg": "basic added" })

    } catch (e) {
        response.status(500).json({ "error": e })
    }
}
//Returns an address based on the users SID
const getAddress = (request, response) =>{
    const sid = request.sessionID
    pool.query('SELECT * FROM basic_address WHERE sid= $1', [sid], (error, results) =>{
        if(error){
            response.status(500).json({"error": error})
        }else if(results.rows.length == 0){
            response.status(404).json({"msg": "not found"})
        }else{
            response.status(200).json({"msg": "succesfully retrieved", "address": results.rows[0].address})
        }
    })
}
module.exports = { createAddress, getAddress }