import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    items: {}
}
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem: ({ items }, action) => {
            //The unique key is a combination of the product id and options to create seperate items based on the choices made 
            const key = action.payload["id"] + JSON.stringify(action.payload["options"])
            //if key already exists simply add quanity and price
            if (items[key]) {
                items[key].quantity += action.payload["quantity"]
            } else {
                items[key] = action.payload
            }
        },
        changeQuantity: ({ items }, {payload:{item, quantity}}) => {
            //The unique key is a combination of the product id and options to create seperate items based on the choices made 
            const key = item["id"] + JSON.stringify(item["options"])
            items[key]["quantity"] = quantity
            console.log(JSON.stringify(items))
        },
        removeItem: (state, action) => {
            const key = action.payload["id"] + JSON.stringify(action.payload["options"])
            delete state.items[key]
        }
    }
})
export default cartSlice.reducer
export const { addItem, changeQuantity, removeItem } = cartSlice.actions
export const getCart = (state) => state.cart.items