import { createSlice } from '@reduxjs/toolkit' 
import { addItemToCart } from '../../utilities/carts/addItemToCart' 
import { updateQuantity } from '../../utilities/carts/updateQuantity' 
import { SERVER_BASE_URL } from '../../config' 
import { deleteItem } from '../../utilities/carts/deleteItem' 
const url = SERVER_BASE_URL
const initialState = {
    items: {},
    total: 0
}
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        /**
         * Adds an item to the cart or updates quantity if it already exists.
         * Generates a unique key based on product properties to differentiate items.
         * 
         * @param {Object} action.payload - The item to add
         * @param {string|number} action.payload.product_id - ID of the product
         * @param {Object} action.payload.options - Selected options for the product
         * @param {string} action.payload.extra - Extra information/instructions
         * @param {number} action.payload.quantity - Quantity to add
         */
        addItem: (state, action) => {
            if (!action.payload) {
                console.log("no item")
                return
            }
            const key = action.payload["product_id"] + JSON.stringify(action.payload["options"]) + action.payload["extra"]
            if (state.items[key]) {
                state.items[key].quantity += action.payload.quantity
                updateQuantity(state.items[key])
            } else {
                state.items[key] = action.payload
                addItemToCart(action.payload)
            }
        },
        /**
         * Updates the quantity of a specific item in the cart.
         * 
         * @param {Object} action.payload - Payload containing target item and new quantity
         * @param {Object} action.payload.item - The item object (used to reconstruct the key)
         * @param {number} action.payload.quantity - The new quantity to set
         */
        changeQuantity: (state, { payload: { item, quantity } }) => {
            //The unique key is a combination of the product id and options to create seperate items based on the choices made
            if (!state.items) {
                console.log("problem !items quantity activated")
                return
            }
            const key = item["product_id"] + JSON.stringify(item["options"]) + item["extra"]
            if (!state.items[key]) {
                console.log("problem !items[key] quantity activated")
                return
            }
            state.items[key]["quantity"] = quantity
            updateQuantity(state.items[key])
        },
        /**
         * Removes an item completely from the cart.
         * 
         * @param {Object} action.payload - The item object to remove (used to reconstruct the key)
         */
        removeItem: (state, action) => {
            if (!state.items) {
                return
            }
            const key = action.payload["product_id"] + JSON.stringify(action.payload["options"]) + action.payload["extra"]
            if (!state.items[key]) {
                console.log("No item to be deleted")
                return
            }
            deleteItem(action.payload)
            delete state.items[key]
        },
        /**
         * Replaces the entire cart items state.
         * Useful for loading saved cart state.
         * 
         * @param {Object} action.payload - The items object to set in state
         */
        loadCart: (state, action) => {
            state.items = action.payload
        },
        /**
         * Updates the total price of the cart.
         * 
         * @param {number} action.payload - The total price value
         */
        setPrice: (state, action) =>{
            state.total = action.payload
        }

    }
})
export default cartSlice.reducer
export const { addItem, changeQuantity, removeItem, loadCart, setPrice} = cartSlice.actions
export const getCart = (state) => state.cart.items
export const getTotal = (state) => state.cart.total