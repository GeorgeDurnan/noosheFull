
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
            response.status(200).json(results.rows[0])
        }

    })
}

const createProduct = (request, response) => {
    const { name, price, description = "", stock = 0, category = "noCat", made_on_request = false } = request.body

    pool.query('INSERT INTO products (name, price, description, stock, category, made_on_request ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [name, price, description, stock], (error, results) => {
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

//For the product_options table
const getOptions = (request, response) => {
    const product_id = parseInt(request.params.id)

    pool.query('SELECT * FROM product_options WHERE product_id = $1', [product_id], (error, results) => {
        if (error) {
            response.status(500).send("Database error" + error)
        } else if (results.rowCount === 0) {
            response.status(404).send(`No product options with ID: ${id} found`)
        } else {
            response.status(200).json(results.rows)
        }

    })
}
const addOption = (request, response) => {
    const { product_id, price, description = "", category_id } = request.body
    pool.query('INSERT INTO product_options (product_id, price, description, category_id) VALUES ($1, $2, $3, $4) RETURNING id',
        [product_id, price, description, category_id], (error, results) => {
            if (error) {
                response.status(500).send("Database error" + error)
            } else {
                response.status(200).send(`Option added with ID: ${id}`)
            }

        })
}
const updateOption = (request, response) => {
    const id = parseInt(request.params.id)
    const { price, description, category_id } = request.body

    pool.query(`UPDATE product_options SET price = COALESCE($1, price), 
        description = COALESCE($2, description), category_id = COALESCE($3, category_id) WHERE id = $4 `,
        [price, description, category_id, id],
        (error, results) => {
            if (error) {
                response.status(404).send(error)
            } else {
                response.status(200).send(`Product modified with ID: ${id}`)
            }

        }
    )
}

const deleteOption = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM product_options WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).send("Database error" + error)
        } else if (results.rowCount === 0) {
            response.status(404).send(`Product option with ID: ${id} not found`)
        } else {
            response.status(200).send(`Product option deleted with ID: ${id}`)
        }

    })
}
//For the category table

const getCategories = (request, response) => {

    pool.query('SELECT * FROM option_categories', (error, results) => {
        if (error) {
            response.status(500).send("Database error" + error)
        } else {
            response.status(200).json(results.rows)
        }

    })
}
const addCategory = (request, response) => {
    const { multiple, description } = request.body
    pool.query('INSERT INTO option_categories (multiple, description) VALUES ($1, $2) RETURNING id',
        [multiple, description], (error, results) => {
            if (error) {
                response.status(500).send("Database error" + error)
            } else {
                response.status(200).send(`Product deleted with ID: ${id}`)
            }

        })
}
const updateCategory = (request, response) => {
    const id = parseInt(request.params.id)
    const { multiple, description } = request.body

    pool.query(`UPDATE option_categories SET multiple = COALESCE($1, multiple), 
        description = COALESCE($2, description) WHERE id = $3 `,
        [multiple, description, id],
        (error, results) => {
            if (error) {
                response.status(404).send(error)
            } else {
                response.status(200).send(`Category modified with ID: ${id}`)
            }

        }
    )
}

const deleteCategory = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM option_categories WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).send("Database error" + error)
        } else if (results.rowCount === 0) {
            response.status(404).send(`Category with ID: ${id} not found`)
        } else {
            response.status(200).send(`Category deleted with ID: ${id}`)
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
const addAllergens = (request, response) => {
    const { product_id, celery = false, gluten = false, crustaceans = false, eggs = false, fish = false, lupin = false, molluscs = false, mustard = false, tree_nuts = false, peanuts = false, sesame = false, soya = false, sulphides = false, milk = false } = request.body
    pool.query('INSERT INTO product_options (product_id, celery, gluten, crustaceans, eggs, fish, lupin, molluscs, mustard, tree_nuts, peanuts, sesame, soya, sulphides, milk) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
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
    createProduct,
    updateProduct,
    deleteProduct,
    getOptions,
    updateOption,
    addOption,
    deleteOption,
    getCategories,
    updateCategory,
    addCategory,
    deleteCategory,
    getAllergens,
    addAllergens,
    updateAllergens,
    deleteAllergens
}