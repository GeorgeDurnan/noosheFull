/**
 * Posts an option to the server.
 * 
 * @param {Object} option - The option object containing details like price, description, and rank.
 * @param {string|number} cat_id - The category ID associated with the option.
 * @param {string|number} product_id - The product ID associated with the option.
 */
export const postOpt = async (option, cat_id, product_id) => {
    // Construct the request body with product and option details
    const body = {
        "product_id": product_id,
        "cat_id": cat_id,
        "price": option["price"],
        "description": option["description"],
        "rank": option["rank"]

    }
    console.log(JSON.stringify(body) + "Body of option")

    // Configure the POST request options including headers and credentials
    const options = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)

    }


    // Send the request to the options endpoint
    const response = await fetch(`${process.env.REACT_APP_API_URL}/options`, options)
    if (process.env.REACT_APP_POSTRESPONSE === "true") {
        console.log(response)
    }

    const data = await response.json()

    if (response.status !== 201) {
        console.log("Product not added error " + data)
    } else {
        console.log(data)
    }
}