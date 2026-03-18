/**
 * Utility function to associate allergens with a specific product ID on the database when uploading the data.
 * Constructs a payload setting each selected allergen to true and sends it to the API.
 * 
 * @param {Object} props
 * @param {Array} props.allergens - Array of selected allergen objects.
 * @param {string|number} product_id - The ID of the product the allergens belong to.
 */
export const postAllergen = async ({ allergens }, product_id) => {
    const body = {}
    allergens.forEach(allergen => {
        body[allergen.value] = true
    })
    body["product_id"] = product_id

    const options = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)

    }


    const response = await fetch(`${process.env.REACT_APP_API_URL}/allergens`, options)
    if (process.env.REACT_APP_POSTRESPONSE === "true") {
        console.log(response)
    }
    const data = await response.json()
    if (response.status == 404) {
        console.log("Product not added error " + data)
    } else {
        console.log(data)
    }
}