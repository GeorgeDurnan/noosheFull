import { SERVER_BASE_URL } from "../../config"
export const getCakeCats = (async () => {
    const url = SERVER_BASE_URL
    try {
        const response = await fetch(url + "cakeCats");
        const text = await response.json();
        return(text)
    } catch (e) {
        console.log("Failed to fetch categories" + e)
        return ([])
    }
})