import { SERVER_BASE_URL } from "../../config"
import { useDispatch } from "react-redux"
import { loadCart } from "../../features/slices/cartSlice"

/**
 * Fetches the current cart items from the server and updates the Redux store.
 * 
 * This function retrieves cart data, transforms the array of items into an object 
 * map keyed by a unique combination of product ID, options, and extras, and then 
 * dispatches the `loadCart` action.
 */
export const useLoadCart = (async () => {
    const url = SERVER_BASE_URL
    const dispatch = useDispatch()
    
    try {
        // Configuration for the fetch request
        const loop = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        
        // Fetch cart items from the server
        const response = await fetch(url + "carts/items", loop) 
        console.log(response)
        
        const data = await response.json()
        const cart = {}
        
        // Transform array data into an object map with composite keys
        data.data.forEach(row => {
            // Create a unique key based on product ID, options, and extra details
            const key = row.product_id + JSON.stringify(row.options) + row.extra
            cart[key] = {
                product_id: row.product_id,
                quantity: row.quantity,
                options: row.options,
                id: row.id,
                extra: row.extra
            }
        })
        
        // Update Redux state with the formatted cart data
        dispatch(loadCart(cart))
    } catch (e) {
        // Error handling (currently empty)
    }
})
