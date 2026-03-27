
const pool = require("../db")

//Returns all products used for populating shop page
const getProducts = (request, response) => {
    pool.query('SELECT * FROM products ORDER BY category_id', (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount == 0) {
            response.status(404).json({ "msg": "No products found" })
        } else {
            response.status(200).json(results.rows)
        }

    })
}

//Return a specific product
const getProductById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": "product not found" })
        } else {
            response.status(200).json(results.rows[0])
        }

    })
}
//Create new product
const createProduct = (request, response) => {
    const { name, price, description = "", category_id } = request.body

    pool.query('INSERT INTO products (name, price, description, category_id) VALUES ($1, $2, $3, $4) RETURNING id', [name, price, description, category_id], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else {
            const newId = results.rows[0].id
            response.status(201).json({ msg: `Product added with ID: ${newId}`, id: newId })
        }

    })
}
//Update existing product
const updateProduct = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, price, description, category_id } = request.body

    pool.query(`UPDATE products SET name = COALESCE($1, name),price = COALESCE($2, price), 
        description = COALESCE($3, description), category_id = COALESCE($4, category_id) WHERE id = $5 `,
        [name, price, description, category_id, id],
        (error, results) => {
            if (error) {
                response.status(500).json({ "msg": "Database error", "error": error })
            } else if (results.rowCount === 0) {
                response.status(404).json({ "msg": `Product with ID: ${id} not found` })
            } else {
                response.status(200).json({ "msg": `Product modified with ID: ${id}` })
            }

        }
    )
}
//Delete product
const deleteProduct = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM products WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": `Product with ID: ${id} not found` })
        } else {
            response.status(200).json({ "msg": `Product deleted with ID: ${id}` })
        }

    })
}



module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}