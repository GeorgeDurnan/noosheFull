import { SERVER_BASE_URL } from "../../config"
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
        const response = await fetch(url + "options/" + product_id, body);
        console.log(response)
        const text = await response.json();
        let options = {}
        text.forEach(option => {
            if (!options[option.cat_id]) {
                options[option.cat_id] = []
            }
            options[option.cat_id][option.rank] = option
        });
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

