const pool = require("../db")

const getOptions = (request, response) => {
    const product_id = parseInt(request.params.id)

    pool.query('SELECT * FROM product_options WHERE product_id = $1 ORDER BY cat_id', [product_id], (error, results) => {
        if (error) {
            response.status(500).send("Database error" + error)
        } else if (results.rowCount === 0) {
            response.status(404).send(`No product options with ID: ${product_id} found`)
        } else {
            response.status(200).json(results.rows)
        }

    })
}
const addOption = (request, response) => {
    const { product_id, price, description = "", cat_id, rank } = request.body
    pool.query('INSERT INTO product_options (product_id, price, description, cat_id, rank) VALUES ($1, $2, $3, $4, $5)',
        [product_id, price, description, cat_id, rank], (error, results) => {
            if (error) {
                response.status(500).send({ "msg": "Database error" + error })
            } else {
                response.status(200).send({ "msg": `Option added` })
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
module.exports ={getOptions, addOption, updateOption,deleteOption}