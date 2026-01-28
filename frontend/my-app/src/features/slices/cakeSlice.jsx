import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    cakes: []
}
const cakesSlice = createSlice({
    name: "cakes",
    initialState,
    reducers: {
        addCakes: (state, action) => {
            const newCakes = []
            action.payload.forEach(cake =>{
                newCakes[cake.id] = cake
            })
            state.cakes = newCakes
        }
    }
})
export default cakesSlice.reducer
export const {addCakes} = cakesSlice.actions
export const getCakes = (state) => state.cakes.cakes
export const getCakeById = (state, id) => state.cakes.cakes[id]