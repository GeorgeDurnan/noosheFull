const pool = require("../db")

//Return all product categories for populating shop page
const getCats = (request, response) => {
    pool.query('SELECT * FROM product_categories ORDER BY rank', (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else {
            response.status(200).json(results.rows)
        }

    })
}
//Create a new product category
const createCat = (request, response) => {
    const { description, rank } = request.body
    pool.query('INSERT INTO product_categories (description, rank) VALUES ($1, $2) RETURNING id', [description, rank], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else {
            const newId = results.rows[0].id
            response.status(201).json({ "msg": `Category added with ID: ${newId}`, "id": newId })
        }

    })
}
// Delete product category
const deleteCat = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM product_categories WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": `Category with ID: ${id} not found`, "id": id })
        } else {
            response.status(200).json({ "msg": `Category with ID: ${id} deleted`, "id": id })
        }

    })
}
//Update product category (description or rank) uses COALESCE to allow for partial update
const updateCat = (request, response) => {
    const id = parseInt(request.params.id)
    const { description, rank } = request.body

    pool.query(`UPDATE product_categories SET description = COALESCE($1, description), "rank" = COALESCE($2, "rank")  WHERE id = $3 `,
        [description, rank, id],
        (error, results) => {
            if (error) {
                response.status(500).json({ "msg": "Database error", "error": error })
            } else {
                response.status(200).json({ "msg": `Category modified with ID: ${id}`, "id": id })
            }

        }
    )
}
module.exports = { getCats, createCat, deleteCat, updateCat }