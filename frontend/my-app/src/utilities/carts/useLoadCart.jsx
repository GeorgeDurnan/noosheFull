import { SERVER_BASE_URL } from "../../config"
import { useDispatch } from "react-redux"
import { loadCart } from "../../features/slices/cartSlice"
export const useLoadCart = (async () => {
    const url = SERVER_BASE_URL
    const dispatch = useDispatch()
    try {
        const loop = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response = await fetch(url + "carts/items", loop);
        console.log(response)
        const data = await response.json()
        const cart = {}
        data.forEach(row => {
            const key = row.product_id + JSON.stringify(row.options)
            cart[key] = {
                product_id: row.product_id,
                quantity: row.quantity,
                options: row.options,
                id: row.id
            }
        })
        dispatch(loadCart(cart))
        ("useLoadCart called")
    } catch (e) {

    }
})
