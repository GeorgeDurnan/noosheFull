import { SERVER_BASE_URL } from "../../config"

/**
 * Updates the quantity of an item in the cart on the server.
 * 
 * @param {Object} item - The cart item object.
 * @param {string|number} item.product_id - The unique identifier for the product.
 * @param {number} item.quantity - The new quantity to set.
 * @param {Object|Array} [item.options] - Any selected options associated with the product.
 */
export const updateQuantity = (async (item) => {
    const url = SERVER_BASE_URL
    try {
        const loop = {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: item.product_id,
                quantity: item.quantity,
                options: item.options
            }
            )
        }
        const response = await fetch(url + "carts", loop) 
        console.log(response)
    } catch (e) {

    }
})
