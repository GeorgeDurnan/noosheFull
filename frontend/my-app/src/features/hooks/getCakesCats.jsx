import { SERVER_BASE_URL } from "../../config"
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
        const response = await fetch(url + "cakeCats", options);
        console.log(response)
        const text = await response.json();
        
        return (text)
    } catch (e) {
        console.log("Failed to fetch categories" + e)
        return ([])
    }
})