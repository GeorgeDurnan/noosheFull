export const postCat = async (cat, product_id) => {
    const body = {
        "multiple": cat["multiple"] || false,
        "description": cat["description"],
        "rank": cat["rank"],
        "required": cat["required"] || false,
        "product_id": product_id

    }
    const options = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)

    }


    const response = await fetch(`http://localhost:5000/categories`, options)
    console.log("category response" + response )
    const data = await response.json()
    if (response.status == 500) {
        console.log("Category not added error" + data)
    } else {
        console.log(data)
    }

    return(data.id)
}