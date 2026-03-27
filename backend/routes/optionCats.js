const pool = require("../db")
//Returns all option categories for a specific product
const getCategories = (request, response) => {
    const product_id = parseInt(request.params.id)
    pool.query('SELECT * FROM option_categories WHERE product_id = $1 ORDER BY rank', [product_id], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": `Categories with product ID: ${product_id} not found` })
        } else {
            response.status(200).json(results.rows)
        }

    })
}
//Adds one option category for a product
const addCategory = (request, response) => {
    const { multiple = false, description, rank, required = false, product_id } = request.body
    pool.query('INSERT INTO option_categories (multiple, description, rank, required, product_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [multiple, description, rank, required, product_id], (error, results) => {
            if (error) {
                response.status(500).json({ "msg": "Database error", "error": error })
            } else {
                const newId = results.rows[0].id
                response.status(201).json({ "msg": `Category created with id:${newId}`, "id": newId })
            }

        })
}
//Update either the type of input or description of a category based on the ID provided
const updateCategory = (request, response) => {
    const id = parseInt(request.params.id)
    const { multiple, description } = request.body

    pool.query(`UPDATE option_categories SET multiple = COALESCE($1, multiple), 
        description = COALESCE($2, description) WHERE id = $3 `,
        [multiple, description, id],
        (error, results) => {
            if (error) {
                response.status(500).json({ "msg": "Database error", "error": error })
            } else if (results.rowCount === 0) {
                response.status(404).json({ "msg": `Category with ID: ${id} not found` })
            } else {
                response.status(200).json({ "msg": `Category modified with ID: ${id}` })
            }

        }
    )
}
//Delete a specific option category
const deleteCategory = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM option_categories WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": `Category with ID: ${id} not found` })
        } else {
            response.status(200).json({ "msg": `Category deleted with ID: ${id}`, "id": id })
        }

    })
}
module.exports = { getCategories, updateCategory, deleteCategory, addCategory }