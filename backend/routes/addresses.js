const pool = require("../db")

const addAddress = (request, response) => {
    const { user_id, type, line_one, line_two = "", city, postcode, country } = request.body
    pool.query('INSERT INTO addresses (user_id, type, line_one, line_two, city, postcode, country) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', [user_id, type, line_one, line_two, city, postcode, country], (error, results) => {
        if (error) {
            response.status(404).send(error)
        } else {
            const newAddresId = results.rows[0].id;
            response.status(201).send(`Address added with ID: ${newAddresId}`)
        }

    })
}
module.exports ={addAddress}