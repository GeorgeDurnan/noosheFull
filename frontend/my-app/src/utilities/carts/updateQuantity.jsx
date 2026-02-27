import { SERVER_BASE_URL } from "../../config"
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
        const response = await fetch(url + "carts", loop);
        console.log(response)
        const data = await response.json()
        const cart = data.map(row => {
            const key = row["product_id"] + JSON.stringify(row["options"])
            return {
                [key]:
                {
                    id: row.product_id,
                    quantity: row.quantity,
                    options: row.options
                }
            }
        });
        return (cart)
    } catch (e) {

    }
})
