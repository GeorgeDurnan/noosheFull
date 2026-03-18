/**
 * Utility function to fetch all cake categories from the backend.
 * 
 * @returns {Promise<Array|undefined>} A promise that resolves to an array of category objects, 
 * or undefined if no categories are found (404).
 */
export const getCategories = () => {
    async function categories() {
        const options = {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',

        }


        const response = await fetch(`${process.env.REACT_APP_API_URL}/cakeCats`, options)
        if (process.env.REACT_APP_POSTRESPONSE === "true") {
            console.log(response)
        }
        const data = await response.json()
        if (response.status == 404) {
            console.log("no categories found")
            return
        } else {
            console.log(data.length + " total categories found")
            return Object.values(data)
        }

    }
    return categories()

}