const pool = require("../db")
const cartRoute = require("./carts")
const addAddress = async (request, response) => {
    const { line_one, line_two = "", city, postcode } = request.body
    const sid = request.sessionID

    // Check if the user has an active cart session before allowing address creation
    const cartQuest = await cartRoute.getCartFromSid(sid)
    if (!cartQuest) {
        return response.status(401).json({ "msg": "Not authorized", "cart": cartQuest })
    }

    // Insert the new address into the database
    pool.query('INSERT INTO addresses (line_one, line_two, city, postcode) VALUES ($1, $2, $3, $4) RETURNING id', [line_one, line_two, city, postcode], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else {
            const newAddresId = results.rows[0].id
            response.status(201).json({ "msg": `Address added with ID: ${newAddresId}`, "id": newAddresId })
        }

    })
}
const deleteAddress = async (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM addresses WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": `Address with ID: ${id} not found` })
        } else {
            response.status(200).json({ "msg": `Address deleted with ID: ${id}` })
        }

    })
}
module.exports = { addAddress, deleteAddress }