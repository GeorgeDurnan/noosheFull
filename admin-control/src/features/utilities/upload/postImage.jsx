/**
 * Uploads an image for a specific product.
 * @param {string|number} product_id - The ID of the product.
 * @param {object} image - The image object containing the file and rank.
 * @returns {Promise<number>} - The ID of the uploaded image.
 */
export const postImage = async (product_id, image) => {
    const body = {
        "file": image["file"],
        "product_id": product_id,
        "rank": image["rank"]

    }
    
    // Check if file is provided
    if (!image["file"]) {
        console.log("no file provided")
        return
    }

    // Create FormData object to send file and data
    const file = new FormData()
    file.append('file', image["file"])
    file.append("product_id", product_id)
    file.append("rank", image["rank"])

    // Configure request options
    const options = {
        method: "POST",
        credentials: 'include',
        body: file

    }


    // Send POST request
    const response = await fetch(`http://localhost:5000/images`, options)
    console.log(response)
    
    // Parse response
    const data = await response.json()
    
    // Check for server errors
    if (response.status == 500) {
        console.log("Image not added error" + data)
    } else {
        console.log(data)
    }

    // Return the ID of the new image
    return (data.id)
}