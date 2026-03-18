import { SERVER_BASE_URL } from "../../config"
import { useDispatch } from "react-redux"
import { fetchItems } from "../../features/slices/cartSlice"
import { v4 as uuidv4 } from 'uuid' 

/**
 * Adds an item to the cart by sending a POST request to the server.
 * 
 * @param {Object} item - The item details to add.
 * @param {string} item.product_id - The unique identifier of the product.
 * @param {number} item.quantity - The quantity to add.
 * @param {any} item.options - Selected product options.
 * @param {any} item.extra - Any additional information for the item.
 */
export const addItemToCart = (async (item) => {
    const url = SERVER_BASE_URL
    uuidv4()
    try {
        const loop = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: item.product_id,
                quantity: item.quantity,
                options: item.options,
                id: uuidv4(),
                extra: item.extra
            }
            )
        }
        const response = await fetch(url + "carts/addItem", loop) 
        console.log(response)
    } catch (e) {
        console.log("error when adding to cart:" + e)
    }
})
