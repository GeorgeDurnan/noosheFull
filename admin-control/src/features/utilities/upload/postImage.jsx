export const postImage = async (product_id, image) => {
    const body = {
        "file": image["file"],
        "product_id": product_id,
        "rank": image["rank"]

    }
    if (!image["file"]) {
        console.log("no file provided")
        return
    }

    const file = new FormData()
    file.append('file', image["file"])
    file.append("product_id", product_id)
    file.append("rank", image["rank"])
    const options = {
        method: "POST",
        credentials: 'include',
        body: file

    }


    const response = await fetch(`http://localhost:5000/images`, options)
    console.log(response)
    const data = await response.json()
    if (response.status == 500) {
        console.log("Image not added error" + data)
    } else {
        console.log(data)
    }

    return (data.id)
}
/*
const data = new FormData()
data.append('upload_preset', 'noosheupload')
data.append(
    'file',
    new Blob([request.file.buffer], { type: request.file.mimetype }),
    request.file.originalname
)

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
}*/