import { SERVER_BASE_URL } from "../../config"
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
        const response = await fetch(url + "images/", options);
        console.log(response)
        const text = await response.json();
        const imgsSorted = {}
        text.forEach(img => {
            if (!imgsSorted[img.product_id]) {
                imgsSorted[img.product_id] = []
            }
            imgsSorted[img.product_id][img.rank] = img

        });

        const keys = Object.keys(imgsSorted)
        keys.forEach(key => {
            imgsSorted[key] = imgsSorted[key].filter(Boolean)
        });
        return (imgsSorted)
    } catch (e) {
        console.log("Failed to fetch cake images" + e)
        return ([])
    }
})