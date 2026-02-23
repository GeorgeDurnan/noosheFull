export const deleteElement = async (product_id, link) => {
    const options = {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'

    }


    const response = await fetch(`http://localhost:5000/${link}/${product_id}`, options)
    return(response)        

}
