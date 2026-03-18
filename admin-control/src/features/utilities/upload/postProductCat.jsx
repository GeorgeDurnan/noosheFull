/**
 * Posts a new product category to the server.
 * 
 * @param {Object} cat - The category object to be posted.
 * @param {string} cat.description - The description of the product category.
 * @param {number} cat.rank - The rank or order of the product category.
 * @returns {Promise<Response>} The response from the fetch request.
 */
export const postProductCat = async (cat) => {
    const body = {
        "description": cat.description,
        "rank": cat.rank

    }
    const options = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)

    }


    const response = await fetch(`${process.env.REACT_APP_API_URL}/cakeCats`, options)
    if (process.env.REACT_APP_POSTRESPONSE === "true") {
        console.log(response)
    }
    return (response)
}  