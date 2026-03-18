/**
 * Updates an entry in the database via a PUT request.
 * 
 * @param {Object} body - The data to update the entry with.
 * @param {string|number} id - The ID of the entry to update.
 * @param {string} link - The API endpoint path (e.g., 'products', 'categories').
 * @returns {Promise<Response>} The fetch response object.
 */
export const updateEntry = async (body, id, link) => {
    const options = {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(body)

    }


    const response = await fetch(`${process.env.REACT_APP_API_URL}/${link}/${id}`, options)
    if (process.env.REACT_APP_POSTRESPONSE === "true") {
        console.log(response)
    }
    return response
}