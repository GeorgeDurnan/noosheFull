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
module.exports = {getCats}