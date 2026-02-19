import { SERVER_BASE_URL } from "../../config"
export const getCakeOptCats = (async (id) => {
    const url = SERVER_BASE_URL
    try {
        const response = await fetch(url + "categories/" + id);
        const text = await response.json();
        return(text)
    } catch (e) {
        console.log("Failed to fetch option categories" + e)
        return ([])
    }
})

