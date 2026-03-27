const pool = require("../db")
//Adds a business contact for the wholesale page 
const createContact = (request, response) => {
    const { name, contactPerson, email, phone, address, textbox} = request.body

    pool.query('INSERT INTO business_contact (name, contact_person, email, phone, address, textbox) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [ name, contactPerson, email, phone, address, textbox], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else {
            const newId = results.rows[0].id 
            response.status(201).json({ msg: `Contact added with ID: ${newId}`, id: newId })
        }

    })
}
const deleteContact = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM business_contact WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": `Contact with ID: ${id} not found` })
        } else {
            response.status(200).json({ "msg": `Contact deleted with ID: ${id}` })
        }

    })
}
module.exports = {createContact, deleteContact}