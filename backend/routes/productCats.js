const pool = require("../db")
const getCats = (request, response) => {
    pool.query('SELECT * FROM product_categories ORDER BY rank', (error, results) => {
        if (error) {
            response.status(500).send("Database error" + error)
        } else {
            response.status(200).json(results.rows)
        }

    })
}
const createCat = (request, response) => {
    const { description, rank } = request.body

    pool.query('INSERT INTO product_categories (description, rank) VALUES ($1, $2) RETURNING id', [description, rank], (error, results) => {
        if (error) {
            response.status(400).send({ error: error })
        } else {
            const newId = results.rows[0].id;
            response.status(201).send({ "msg": `Order added with ID: ${newId}`, "id": { newId } })
        }

    })
}
const deleteCat = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM product_categories WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).send({ "msg": "Database error" + error, "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).send({ "msg": `Category with ID: ${id} not found`, "id": id })
        } else {
            response.status(200).send({ "msg": `Category with ID: ${id} deleted`, "id": id })
        }

    })
}
const updateCat = (request, response) => {
    const id = parseInt(request.params.id)
    const { description, rank } = request.body

    pool.query(`UPDATE product_categories SET description = COALESCE($1, description), "rank" = COALESCE($2, "rank")  WHERE id = $3 `,
        [description, rank, id],
        (error, results) => {
            if (error) {
                response.status(404).send({ "error": error })
            } else {
                response.status(200).send({ "msg": `Category modified with ID: ${id}`, "id": id })
            }

        }
    )
}
module.exports = { getCats, createCat, deleteCat, updateCat }