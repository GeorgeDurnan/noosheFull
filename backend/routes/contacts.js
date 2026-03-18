const pool = require("../db")

//TODO: Add an sid to associate with the contact for sending cart reminders to 
//Adds a contact (name, email) for nooshe as an inbound lead 
const createContact = (request, response) => {
    const { name, email } = request.body

    pool.query('INSERT INTO contacts (name, email) VALUES ($1, $2) RETURNING id', [name, email], (error, results) => {
        if (error) {
            response.status(500).json(error)
        } else {
            const newId = results.rows[0].id
            response.status(201).json({ "msg": `Contact added with ID: ${newId}` })
        }

    })
}
module.exports = {
    createContact
}