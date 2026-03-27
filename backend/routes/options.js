const pool = require("../db")

// Get all options for a specific product
const getOptions = (request, response) => {
    const product_id = parseInt(request.params.id)

    pool.query('SELECT * FROM product_options WHERE product_id = $1 ORDER BY cat_id', [product_id], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": `No product options with ID: ${product_id} found` })
        } else {
            response.status(200).json(results.rows)
        }

    })
}
// Add a new option
const addOption = (request, response) => {
    const { product_id, price, description = "", cat_id, rank } = request.body
    pool.query('INSERT INTO product_options (product_id, price, description, cat_id, rank) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [product_id, price, description, cat_id, rank], (error, results) => {
            if (error) {
                response.status(500).json({ "msg": "Database error", "error": error })
            } else {
                const newId = results.rows[0].id
                response.status(201).json({ "msg": `Option added`, "id": newId })
            }

        })
}
// Update a specific option via COALESCE to allow for partial updates
const updateOption = (request, response) => {
    const id = parseInt(request.params.id)
    const { price, description, cat_id } = request.body

    pool.query(`UPDATE product_options SET price = COALESCE($1, price), 
        description = COALESCE($2, description), cat_id = COALESCE($3, cat_id) WHERE id = $4 `,
        [price, description, cat_id, id],
        (error, results) => {
            if (error) {
                response.status(500).json({ "msg": "Database error", "error": error })
            } else if (results.rowCount === 0) {
                response.status(404).json({ "msg": `Option with ID: ${id} not found`})
            } else {
                response.status(200).json({ "msg": `Option modified with ID: ${id}` })
            }

        }
    )
}
// Delete an option
const deleteOption = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM product_options WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": `Product option with ID: ${id} not found` })
        } else {
            response.status(200).json({ "msg": `Product option deleted with ID: ${id}` })
        }

    })
}
module.exports = { getOptions, addOption, updateOption, deleteOption }