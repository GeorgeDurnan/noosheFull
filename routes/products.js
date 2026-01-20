const pool = require("../db")

const getProducts = (request, response) => {
    pool.query('SELECT * FROM products ORDER BY id ASC', (error, results) => {
        if (error) {
            response.status(500).send("Database error" + error)
        }
        response.status(200).json(results.rows)
    })
}

const getProductById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        } else if (results.rows.length === 0) {
            response.status(404).send("product not found")
        } else {
            response.status(200).json(results.rows)
        }

    })
}

const createProduct = (request, response) => {
    const { name, price, description = "", stock = 0 } = request.body

    pool.query('INSERT INTO products (name, price, description,  stock ) VALUES ($1, $2, $3, $4) RETURNING id', [name, price, description, stock], (error, results) => {
        if (error) {
            response.status(400).send(error)
        } else {
            const newId = results.rows[0].id;
            response.status(201).send(`Product added with ID: ${newId}`)
        }

    })
}

const updateProduct = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, price, description, stock } = request.body

    pool.query(`UPDATE products SET name = COALESCE($1, name),price = COALESCE($2, price), 
        description = COALESCE($3, description), stock = COALESCE($4, stock) WHERE id = $5 `,
        [name, price, description, stock, id],
        (error, results) => {
            if (error) {
                response.status(404).send(error)
            } else {
                response.status(200).send(`Product modified with ID: ${id}`)
            }

        }
    )
}

const deleteProduct = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM products WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).send("Database error" + error)
        } else if (results.rowCount === 0) {
            response.status(404).send(`Product with ID: ${id} not found`)
        } else {
            response.status(200).send(`Product deleted with ID: ${id}`)
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