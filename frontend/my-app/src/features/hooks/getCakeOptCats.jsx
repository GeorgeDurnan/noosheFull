import { SERVER_BASE_URL } from "../../config"
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
        const response = await fetch(url + "categories/" + id, options);
        console.log(response)
        const text = await response.json();
        console.log("options gotten" + JSON.stringify(text))
        return (text)
    } catch (e) {
        console.log("Failed to fetch option categories" + e)
        return ([])
    }
})

