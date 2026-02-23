
const pool = require("../db")
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
    const { product_id, celery = false, gluten = false, crustaceans = false, eggs = false, fish = false, lupin = false, molluscs = false, mustard = false, tree_nuts = false, peanuts = false, sesame = false, soya = false, sulphides = false, lactose = false } = request.body
    pool.query('INSERT INTO allergens (product_id, celery, gluten, crustaceans, eggs, fish, lupin, molluscs, mustard, tree_nuts, peanuts, sesame, soya, sulphides, lactose) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
        [product_id, celery, gluten, crustaceans, eggs, fish, lupin, molluscs, mustard, tree_nuts, peanuts, sesame, soya, sulphides, lactose], (error, results) => {
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
    getAllergens,
    addAllergens,
    updateAllergens,
    deleteAllergens,
    getAllAllergens
}