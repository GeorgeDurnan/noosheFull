export const postOpt = async (option, cat_id, product_id) => {
    const body = {
        "product_id": product_id,
        "cat_id": cat_id,
        "price": option["price"],
        "description": option["description"],
        "rank": option["rank"]

    }
    console.log(JSON.stringify(body) + "Body of option")
    const options = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)

    }


    const response = await fetch(`http://localhost:5000/options`, options)
    console.log(response)
    const data = await response.json()
    if (response.status == 404) {
        console.log("Product not added error " + data)
    } else {
        console.log(data)
    }
}