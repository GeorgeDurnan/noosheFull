export const postAllergen = async ({allergens}, product_id) => {
    const body = {}
    allergens.forEach(allergen => {
        body[allergen.value] = true
    });
    body["product_id"] = product_id

    const options = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)

    }


    const response = await fetch(`http://localhost:5000/allergens`, options)
    const data = await response.text()
    if (response.status == 404) {
        console.log("Product not added error " + data)
    } else {
        console.log(data)
    }
}