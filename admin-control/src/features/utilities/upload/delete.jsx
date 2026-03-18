/**
 * Utility function to delete a generic item/resource from the database.
 * My original goal was to have all api fetches to be generic but i wasnt able to do it in the end
 *
 * @param {string|number} product_id - The ID of the item to delete.
 * @param {string} link - The API endpoint path (e.g. "products", "users") to send the DELETE request to.
 * @returns {Promise<Response>} The fetch Response object.
 */
export const deleteElement = async (product_id, link) => {
    const options = {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'

    }


    const response = await fetch(`${process.env.REACT_APP_API_URL}/${link}/${product_id}`, options)
    if (process.env.REACT_APP_POSTRESPONSE === "true") {
        console.log(response)
    }
    return (response)

}
