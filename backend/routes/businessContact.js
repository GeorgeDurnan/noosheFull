const pool = require("../db")
const createContact = (request, response) => {
    const { name, contactPerson, email, phone, address, textbox} = request.body

    pool.query('INSERT INTO business_contact (name, contact_person, email, phone, address, textbox) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [ name, contactPerson, email, phone, address, textbox], (error, results) => {
        if (error) {
            response.status(400).json({"error": error})
        } else {
            const newId = results.rows[0].id;
            response.status(200).json({ msg: `Contact added with ID: ${newId}`, id: newId })
        }

    })
}
module.exports = {createContact}