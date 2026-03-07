import { configureStore } from "@reduxjs/toolkit";
import cakeSlice from "../features/slices/cakeSlice";
import cartSlice from "../features/slices/cartSlice"
import addressSlice from "../features/slices/addressSlice"
export default configureStore({
    reducer: {
        cakes: cakeSlice,
        cart: cartSlice,
        address: addressSlice
    }}
)