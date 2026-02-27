import { createSlice } from '@reduxjs/toolkit';
import { addItemToCart } from '../../utilities/carts/addItemToCart';
import { updateQuantity } from '../../utilities/carts/updateQuantity';
import { SERVER_BASE_URL } from '../../config';
import { deleteItem } from '../../utilities/carts/deleteItem';
const url = SERVER_BASE_URL
const initialState = {
    items: {},
    loading: "idle"
}
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem: (state, action) => {
            if (!action.payload) {
                console.log("no item")
                return
            }
            const key = action.payload["product_id"] + JSON.stringify(action.payload["options"])
            if (state.items[key]) {
                state.items[key].quantity += action.payload.quantity
                updateQuantity(state.items[key])
            } else {
                state.items[key] = action.payload
                addItemToCart(action.payload)
            }
        },
        changeQuantity: ({ items }, { payload: { item, quantity } }) => {
            //The unique key is a combination of the product id and options to create seperate items based on the choices made
            if (!items) {
                console.log("problem !items quantity activated")
                return
            }
            const key = item["product_id"] + JSON.stringify(item["options"])
            if (!items[key]) {
                console.log("problem !items[key] quantity activated")
                return
            }
            items[key]["quantity"] = quantity
            updateQuantity(items[key])
        },
        removeItem: (state, action) => {
            if (!state.items) {
                return
            }
            const key = action.payload["product_id"] + JSON.stringify(action.payload["options"])
            if (!state.items[key]) {
                console.log("No item to be deleted")
                return
            }
            deleteItem(action.payload)
            delete state.items[key]
        },
        loadCart: (state, action) => {
            state.items = action.payload
        }
    }
})
export default cartSlice.reducer
export const { addItem, changeQuantity, removeItem, loadCart } = cartSlice.actions
export const getCart = (state) => state.cart.items