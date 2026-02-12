const pool = require("../db")
const addImage = (request, response) => {
    const { product_id, rank } = request.body
    const url = request.cloud
    pool.query('INSERT INTO images ("product_id", "url", "rank") VALUES ($1, $2, $3)', [product_id, url, rank], (error, results) => {
        if (error) {
            response.status(404).send({ "error": error, "msg": "Failed to add to server", "product_id": product_id, "rank": rank, "url": url || "no url", "response": request.reso, "poop": request.poop })
        } else {
            response.status(201).send({msg: `Image added for product: ${product_id}`})
        }

    })
}

// ...existing code...
const sendImage = async (request, response, next) => {
    if (!request.file) return response.status(400).json({ error: 'No file provided' })

    const data = new FormData()
    data.append('upload_preset', 'noosheupload')
    data.append(
        'file',
        new Blob([request.file.buffer], { type: request.file.mimetype }),
        request.file.originalname
    )
    request.poop = data

    const options = {
        method: 'POST',
        body: data,
        headers: data.getHeaders ? data.getHeaders() : {}
    }

    try {
        const repo = await fetch(`https://api.cloudinary.com/v1_1/deiawollp/image/upload`, options)
        const reso = await repo.json()
        request.reso = reso
        if (reso.error) return response.status(400).json({ error: reso.error, msg: 'Cloud upload failed', response: reso })
        request.cloud = reso.secure_url
        next()
    } catch (e) {
        return response.status(500).json({ error: e.message || e, msg: 'Failed to add to cloud' })
    }
}
// ...existing code...
const deleteImage = (request, response) => {
    const { product_id, rank } = request.body

    pool.query('DELETE FROM allergens WHERE product_id = $1 AND rank = $2', [product_id, rank], (error, results) => {
        if (error) {
            response.status(500).send("Database error" + error)
        } else if (results.rowCount === 0) {
            response.status(404).send(`Product image with rank: ${rank} not found`)
        } else {
            response.status(200).send(`Product image with rank: ${rank} deleted`)
        }

    })
}
module.exports = { addImage, sendImage }