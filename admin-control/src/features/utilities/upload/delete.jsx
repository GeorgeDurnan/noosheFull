export const deleteProduct = async (product_id) => {
    const options = {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'

    }


    const response = await fetch(`http://localhost:5000/products/${product_id}`, options)
    console.log(response)
    return(response.msg)        

}
