import { SERVER_BASE_URL } from "../../config"
import { useDispatch } from "react-redux"
import { fetchItems } from "../../features/slices/cartSlice"
import { v4 as uuidv4 } from 'uuid';
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
                id: uuidv4()
            }
            )
        }
        const response = await fetch(url + "carts/addItem", loop);
        console.log(response)
    } catch (e) {
        console.log("error when adding to cart:" + e)
    }
})
