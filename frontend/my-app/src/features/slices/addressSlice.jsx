import { SERVER_BASE_URL } from '../../config' 
import { createSlice } from '@reduxjs/toolkit' 
const url = SERVER_BASE_URL

const initialState = {
    address: null,
    fullAddress: null
}

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {
        setAddress: (state, action) => {
            state.address = action.payload
        },
        setFullAddress: (state, action) => {
            state.fullAddress = action.payload
        }
        
    }

})
export default addressSlice.reducer
export const { setAddress, setFullAddress } = addressSlice.actions 

export const getFullAddressFromSlice = (state) => state.address.fullAddress

export const getAddressFromSlice = (state) => state.address.address