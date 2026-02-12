import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    productId: 0
}
const helperSlice = createSlice({
    name: "helper",
    initialState,
    reducers: {
        changeProduct: (state, action) => {
            state.productId = action.payload
        }
    }
})

export default helperSlice.reducer
export const {changeProduct} = helperSlice.actions
export const getProductId = (state) => state.helper.productId