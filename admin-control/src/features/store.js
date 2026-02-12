import { configureStore } from "@reduxjs/toolkit";
import helperReducer from "./slices/optionslice"
export default configureStore({
    reducer: {
        helper: helperReducer
    }}
)