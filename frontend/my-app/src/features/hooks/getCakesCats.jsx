import { SERVER_BASE_URL } from "../../config"

/**
 * Fetches cake categories from the server.
 * 
 * @returns {Promise<Array>} A promise that resolves to the list of cake categories.
 *                           Returns an empty array in case of error.
 */
export const getCakeCats = (async () => {
    const url = SERVER_BASE_URL
    try {
        const options = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response = await fetch(url + "cakeCats", options) 
        console.log(response)
        const text = await response.json() 
        
        return (text)
    } catch (e) {
        console.log("Failed to fetch categories" + e)
        return ([])
    }
})