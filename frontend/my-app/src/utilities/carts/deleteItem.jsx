import { SERVER_BASE_URL } from "../../config"
import { fetchItems } from "../../features/slices/cartSlice"
import { v4 as uuidv4 } from 'uuid';
import { removeItem } from "../../features/slices/cartSlice";
export const deleteItem = (async (item) => {
    const url = SERVER_BASE_URL
    console.log("options here" + JSON.stringify(item.options))
    console.log("item id" + item.id)
    try {
        const loop = {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: item.id
            }
            )
        }
        const response = await fetch(url + "carts/items", loop);
        console.log(response)
    } catch (e) {
        console.log("error when adding to cart:" + e)
    }
})
