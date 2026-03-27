const pool = require("../db")

//TODO: Add an sid to associate with the contact for sending cart reminders to 
//Adds a contact (name, email) for nooshe as an inbound lead 
const createContact = (request, response) => {
    const { name, email } = request.body

    pool.query('INSERT INTO contacts (name, email) VALUES ($1, $2) RETURNING id', [name, email], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else {
            const newId = results.rows[0].id
            response.status(201).json({ "msg": `Contact added with ID: ${newId}`, "id": newId})
        }

    })
}
const deleteContact = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM contacts WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": `Contact with ID: ${id} not found` })
        } else {
            response.status(200).json({ "msg": `Contact deleted with ID: ${id}` })
        }

    })
}
module.exports = {
    createContact, deleteContact
}