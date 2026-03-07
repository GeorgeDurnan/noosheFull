const pool = require("../db")
const cartRoute = require("./carts")
const addAddress = async (request, response) => {
    const { user_id, line_one, line_two = "", city, postcode } = request.body
    const sid = request.sessionID
    const cartQuest = await cartRoute.getCartFromSid(sid)
    if(!cartQuest){
        return response.status(401).json({"msg": "Not authorized", "cart": cartQuest})
    }
    pool.query('INSERT INTO addresses (line_one, line_two, city, postcode) VALUES ($1, $2, $3, $4) RETURNING id', [line_one, line_two, city, postcode], (error, results) => {
        if (error) {
            response.status(500).json({"error": error})
        } else {
            const newAddresId = results.rows[0].id;
            response.status(200).json({"msg":`Address added with ID: ${newAddresId}`, "id": newAddresId})
        }

    })
}
module.exports ={addAddress}