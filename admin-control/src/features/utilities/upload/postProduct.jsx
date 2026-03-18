/**
 * Posts a new product to the server.
 * @param {Object} cake - The product object containing name, category, price, and description.
 * @returns {Promise<number>} The ID of the created product.
 */
export const postProduct = async (cake) => {
    const body = {
        "name": cake["name"],
        "category_id": cake["category"].id,
        "price": cake["price"],
        "description": cake["description"]

    }
    console.log("product body" + JSON.stringify(body))

    const options = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)

    }


    const response = await fetch(`${process.env.REACT_APP_API_URL}/products`, options)
    if (process.env.REACT_APP_POSTRESPONSE === "true") {
        console.log(response)
    }
    const data = await response.json()
    if (response.status == 404) {
        console.log("Product not added error " + data)
    } else {
        console.log(data)
    }

    return (data.id)
}