import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    cakes: [],
    orderedCakes: {},
    rankedCategories: [],
    orderedCategories: {}
}
const cakesSlice = createSlice({
    name: "cakes",
    initialState,
    reducers: {
        addCakes: (state, action) => {
            const newCakes = []
            action.payload.forEach(cake => {
                newCakes[cake.id] = cake
            })
            state.cakes = newCakes
            action.payload.forEach(cake => {
                if (!state.orderedCakes[cake.category_id]) {
                    state.orderedCakes[cake.category_id] = []
                }
                state.orderedCakes[cake.category_id].push(cake)
            })

        },
        addCategories: (state, action) => {
            let cats = []
            action.payload.forEach(cat => {
                cats[cat.rank] = cat
            });
            cats = cats.filter(Boolean)
            state.rankedCategories = action.payload
            action.payload.forEach(cat => {
                if (!state.orderedCategories[cat.id]) {
                    state.orderedCategories[cat.id] = []
                }
                state.orderedCategories[cat.id].push(cat)
            })
        }
    }
})
export default cakesSlice.reducer
export const { addCakes, addCategories } = cakesSlice.actions
export const getCakes = (state) => state.cakes.cakes
export const getCakeById = (state, id) => state.cakes.cakes[id]
export const getOrderedCakes = (state) => state.cakes.orderedCakes
export const getRankedCats = (state) => state.cakes.rankedCategories
export const getOrderedCats = (state) => state.cakes.orderedCategories
export const getCatById = (state, id) => state.cakes.orderedCategories[id]