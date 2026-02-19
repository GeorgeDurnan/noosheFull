
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
    const { name, price, description = "", category = "noCat" } = request.body

    pool.query('INSERT INTO products (name, price, description, category) VALUES ($1, $2, $3, $4) RETURNING id', [name, price, description, category], (error, results) => {
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

//add allergens

const getAllergens = (request, response) => {
    const product_id = parseInt(request.params.id)

    pool.query('SELECT * FROM allergens WHERE product_id = $1', [product_id], (error, results) => {
        if (error) {
            response.status(500).send("Database error" + error)
        } else if (results.rowCount === 0) {
            response.status(404).send(`No product allergens with product ID: ${id} found`)
        } else {
            response.status(200).json(results.rows)
        }

    })
}
const getAllAllergens = (request, response) => {

    pool.query('SELECT * FROM allergens', (error, results) => {
        if (error) {
            response.status(500).send("Database error" + error)
        } else if (results.rowCount === 0) {
            response.status(404).send(`No product allergens found`)
        } else {
            response.status(200).json(results.rows)
        }

    })
}
const addAllergens = (request, response) => {
    const { product_id, celery = false, gluten = false, crustaceans = false, eggs = false, fish = false, lupin = false, molluscs = false, mustard = false, tree_nuts = false, peanuts = false, sesame = false, soya = false, sulphides = false, milk = false } = request.body
    pool.query('INSERT INTO allergens (product_id, celery, gluten, crustaceans, eggs, fish, lupin, molluscs, mustard, tree_nuts, peanuts, sesame, soya, sulphides, milk) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
        [product_id, celery, gluten, crustaceans, eggs, fish, lupin, molluscs, mustard, tree_nuts, peanuts, sesame, soya, sulphides, milk], (error, results) => {
            if (error) {
                response.status(500).send("Database error" + error)
            } else {
                response.status(200).send(`Allergen added with product id: ${product_id}`)
            }

        })
}
const updateAllergens = (request, response) => {
    const product_id = parseInt(request.params.id)

    const {
        celery,
        gluten,
        crustaceans,
        eggs,
        fish,
        lupin,
        molluscs,
        mustard,
        tree_nuts,
        peanuts,
        sesame,
        soya,
        sulphides,
        milk
    } = request.body

    pool.query(
        `
        UPDATE allergens
        SET
            celery = COALESCE($1, celery),
            gluten = COALESCE($2, gluten),
            crustaceans = COALESCE($3, crustaceans),
            eggs = COALESCE($4, eggs),
            fish = COALESCE($5, fish),
            lupin = COALESCE($6, lupin),
            molluscs = COALESCE($7, molluscs),
            mustard = COALESCE($8, mustard),
            tree_nuts = COALESCE($9, tree_nuts),
            peanuts = COALESCE($10, peanuts),
            sesame = COALESCE($11, sesame),
            soya = COALESCE($12, soya),
            sulphides = COALESCE($13, sulphides),
            milk = COALESCE($14, milk)
        WHERE product_id = $15
        `,
        [
            celery,
            gluten,
            crustaceans,
            eggs,
            fish,
            lupin,
            molluscs,
            mustard,
            tree_nuts,
            peanuts,
            sesame,
            soya,
            sulphides,
            milk,
            product_id
        ],
        (error) => {
            if (error) {
                response.status(400).json(error)
            } else {
                response.status(200).send(`Allergens updated for product ID: ${product_id}`)
            }
        }
    )
}

const deleteAllergens = (request, response) => {
    const product_id = parseInt(request.params.id)

    pool.query('DELETE FROM allergens WHERE product_id = $1', [product_id], (error, results) => {
        if (error) {
            response.status(500).send("Database error" + error)
        } else if (results.rowCount === 0) {
            response.status(404).send(`Product option with ID: ${product_id} not found`)
        } else {
            response.status(200).send(`Product option deleted with ID: ${product_id}`)
        }

    })
}

module.exports = {
    getProducts,
    getProductById,
    getCakeCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllergens,
    addAllergens,
    updateAllergens,
    deleteAllergens,
    getAllAllergens
}