
const pool = require("../db")
// Get allergens for a specific product by ID
const getAllergens = (request, response) => {
    const product_id = parseInt(request.params.id)

    pool.query('SELECT * FROM allergens WHERE product_id = $1', [product_id], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": `No product allergens with product ID: ${product_id} found`, "id": product_id })
        } else {
            response.status(200).json(results.rows)
        }

    })
}

// Get all allergens for all products
const getAllAllergens = (request, response) => {

    pool.query('SELECT * FROM allergens', (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json(`No product allergens found`)
        } else {
            response.status(200).json(results.rows)
        }

    })
}
// Add allergens for a new product
const addAllergens = (request, response) => {
    const { product_id, celery = false, gluten = false, crustaceans = false, eggs = false, fish = false, lupin = false, molluscs = false, mustard = false, tree_nuts = false, peanuts = false, sesame = false, soya = false, sulphides = false, lactose = false } = request.body
    pool.query('INSERT INTO allergens (product_id, celery, gluten, crustaceans, eggs, fish, lupin, molluscs, mustard, tree_nuts, peanuts, sesame, soya, sulphides, lactose) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
        [product_id, celery, gluten, crustaceans, eggs, fish, lupin, molluscs, mustard, tree_nuts, peanuts, sesame, soya, sulphides, lactose], (error, results) => {
            if (error) {
                response.status(500).json({ "msg": "Database error", "error": error })
            } else {
                response.status(201).json({ "msg": `Allergen added with product id: ${product_id}` })
            }

        })
// Update allergens for an existing product
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
        lactose
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
            lactose = COALESCE($14, lactose)
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
            lactose,
            product_id
        ],
        (error, results) => {
            if (error) {
                response.status(500).json({ "msg": "Database error", "error": error })
            } else if (results.rowCount === 0) {
                response.status(404).json({ "msg": `No product allergens found with ID: ${product_id}` })
            } else {
                response.status(200).json({ "msg": `Allergens updated for product ID: ${product_id}` })
            }
        }
    )
}
// Delete allergens for a product

const deleteAllergens = (request, response) => {
    const product_id = parseInt(request.params.id)

    pool.query('DELETE FROM allergens WHERE product_id = $1', [product_id], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": `Product option with ID: ${product_id} not found` })
        } else {
            response.status(200).json({ "msg": `Product option deleted with ID: ${product_id}` })
        }

    })
}
module.exports = {
    getAllergens,
    addAllergens,
    updateAllergens,
    deleteAllergens,
    getAllAllergens
}