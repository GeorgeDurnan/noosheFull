import { configureStore } from "@reduxjs/toolkit";
import cakeSlice from "../features/slices/cakeSlice";
export default configureStore({
    reducer: {
        cakes: cakeSlice
    }}
)