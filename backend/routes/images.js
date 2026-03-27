const pool = require("../db")
// TODO: Replace with local backend storage solution in future update.

// Middleware: Uploads file buffer to Cloudinary.
// Attaches the secure URL to request.cloud upon success.
const sendImage = async (request, response, next) => {
    if (!request.file) return response.status(400).json({ error: 'No file provided' })

    const data = new FormData()
    data.append('upload_preset', 'noosheupload')
    data.append(
        'file',
        new Blob([request.file.buffer], { type: request.file.mimetype }),
        request.file.originalname
    )
    request.imageData = data

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
    } catch (error) {
        return response.status(500).json({ "msg": "Database error", "error": error.message || error })
    }
}
// Saves image url to DB.
// Expects request.cloud (URL) from the sendImage middleware.
const addImage = (request, response) => {
    const { product_id, rank } = request.body
    const url = request.cloud
    pool.query('INSERT INTO images ("product_id", "url", "rank") VALUES ($1, $2, $3)', [product_id, url, rank], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else {
            response.status(201).json({ msg: `Image added for product: ${product_id}` })
        }

    })
}
//Deletes specific image
const deleteImage = (request, response) => {
    const { product_id, rank } = request.body

    pool.query('DELETE FROM images WHERE product_id = $1 AND rank = $2', [product_id, rank], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": `Product image with rank: ${rank} not found` })
        } else {
            response.status(200).json({ "msg": `Product image with rank: ${rank} deleted` })
        }

    })
}
//Return all images for a specific product
const getImages = (request, response) => {
    const product_id = parseInt(request.params.id)
    pool.query('SELECT * FROM images WHERE product_id = $1 ORDER BY rank', [product_id], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount == 0) {
            response.status(404).json({ "msg": `No images found for that product id` })

        } else {
            response.status(200).json(results.rows)
        }

    })
}
// Return all images database-wide
const getAllImages = (request, response) => {
    pool.query('SELECT * FROM images ORDER BY product_id', (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount == 0) {
            response.status(404).json({ "msg": `No images found` })

        } else {
            response.status(200).send(results.rows)
        }

    })
}
module.exports = { addImage, sendImage, getImages, getAllImages, deleteImage }