import { SERVER_BASE_URL } from "../../config"

/**
 * Fetches cake options for a given product ID from the server.
 * Organizes options by category ID and rank.
 * 
 * @param {string|number} product_id - The ID of the product to fetch options for.
 * @returns {Promise<Object>} A promise that resolves to an object grouping options by category ID.
 */
export const getCakeOptions = (async (product_id) => {
    const url = SERVER_BASE_URL
    try {
        const body = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response = await fetch(url + "options/" + product_id, body) 
        console.log(response)
        const text = await response.json() 
        let options = {}

        // Group options by category ID and place them according to their rank
        text.forEach(option => {
            if (!options[option.cat_id]) {
                options[option.cat_id] = []
            }
            options[option.cat_id][option.rank] = option
        }) 
        
        // Remove any empty slots in the arrays caused by non-sequential ranks
        const keys = Object.keys(options)
        keys.forEach((opt) => {
            options[opt] = options[opt].filter(Boolean)
        })
        return (options)
    } catch (e) {
        console.log("Failed to fetch options" + e)
        return ([])
    }
})

