import { SERVER_BASE_URL } from "../../config"
import { fetchItems } from "../../features/slices/cartSlice"
import { v4 as uuidv4 } from 'uuid' 
import { removeItem } from "../../features/slices/cartSlice" 

/**
 * Sends a DELETE request to remove an item from the user's cart on the server.
 * 
 * @param {Object} item - The cart item to be removed.
 * @param {string} item.id - The unique identifier of the item.
 */
export const deleteItem = (async (item) => {
    const url = SERVER_BASE_URL
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
        const response = await fetch(url + "carts/items", loop) 
        console.log(response)
    } catch (e) {
        console.log("error when adding to cart:" + e)
    }
})
