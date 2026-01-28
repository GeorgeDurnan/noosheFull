const pool = require("../db")

const createContact = (request, response) => {
    const { name, email } = request.body

    pool.query('INSERT INTO contacts (name, email) VALUES ($1, $2) RETURNING id', [name, email], (error, results) => {
        if (error) {
            response.status(400).send(error)
        } else {
            const newId = results.rows[0].id;
            response.status(201).send(`Contact added with ID: ${newId}`)
        }

    })
}
module.exports = {
    createContact
}