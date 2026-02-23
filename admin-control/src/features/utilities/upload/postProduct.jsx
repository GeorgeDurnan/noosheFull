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


    const response = await fetch(`http://localhost:5000/products`, options)
    console.log(response)
    const data = await response.json()
    if (response.status == 404) {
        console.log("Product not added error " + data)
    } else {
        console.log(data)
    }

    return(data.id)
}