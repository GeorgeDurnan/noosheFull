
const pool = require("../db")

const getProducts = (request, response) => {
    pool.query('SELECT * FROM products ORDER BY category_id', (error, results) => {
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
            response.status(200).json(results.rows[0])
        }

    })
}
const getCakeCategories = (request, response) => {

    pool.query('SELECT category FROM products GROUP BY category', (error, results) => {
        if (error) {
            response.status(400).send(error)
        } else if (results.rows.length === 0) {
            response.status(404).send("no categories found")
        } else {
            response.status(200).json(results.rows)
        }

    })
}


const createProduct = (request, response) => {
    const { name, price, description = "", category_id} = request.body

    pool.query('INSERT INTO products (name, price, description, category_id) VALUES ($1, $2, $3, $4) RETURNING id', [name, price, description, category_id], (error, results) => {
        if (error) {
            response.status(400).send(error)
        } else {
            const newId = results.rows[0].id;
            response.status(201).send({ msg: `Product added with ID: ${newId}`, id: newId })
        }

    })
}

const updateProduct = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, price, description, stock, category, made_on_request } = request.body

    pool.query(`UPDATE products SET name = COALESCE($1, name),price = COALESCE($2, price), 
        description = COALESCE($3, description), stock = COALESCE($4, stock), category = COALESCE($5, category), made_on_request = COALESCE($6, made_on_request) WHERE id = $7 `,
        [name, price, description, stock, category, made_on_request, id],
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
    getCakeCategories,
    createProduct,
    updateProduct,
    deleteProduct
}