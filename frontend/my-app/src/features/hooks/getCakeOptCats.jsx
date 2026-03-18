import { SERVER_BASE_URL } from "../../config"

/**
 * Fetches cake option categories from the server.
 * 
 * @param {string|number} id - The ID of the cake/product to fetch options for.
 * @returns {Promise<Array>} The cake option categories.
 */
export const getCakeOptCats = (async (id) => {
    const url = SERVER_BASE_URL
    try {
        const options = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response = await fetch(url + "categories/" + id, options) 
        console.log(response)
        const text = await response.json() 
        return (text)
    } catch (e) {
        console.log("Failed to fetch option categories" + e)
        return ([])
    }
})

