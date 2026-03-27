import { SERVER_BASE_URL } from "../../config"

/**
 * Fetches all cake images from the server and organizes them by product ID.
 * The images are sorted by their 'rank' property.
 * 
 * @returns {Promise<Object>} A promise resolving to an object where keys are product IDs 
 * and values are arrays of image objects. Returns an empty array on failure.
 */
export const getCakeImgs = (async () => {
    const url = SERVER_BASE_URL
    try {
        const options = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response = await fetch(url + "cakes", options) 
        console.log(response)
        const text = await response.json() 
        const imgsSorted = {}

        // Sort images into sparse arrays based on rank, grouped by product ID
        text.forEach(img => {
            if (!imgsSorted[img.product_id]) {
                imgsSorted[img.product_id] = []
            }
            // Assigning by rank index ensures order but may create empty slots
            imgsSorted[img.product_id][img.rank] = img

        }) 

        const keys = Object.keys(imgsSorted)
        keys.forEach(key => {
            // Remove any undefined/empty slots from the sparse arrays
            imgsSorted[key] = imgsSorted[key].filter(Boolean)
        }) 
        return (imgsSorted)
    } catch (e) {
        console.log("Failed to fetch cake images" + e)
        return ([])
    }
})