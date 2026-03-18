import { createSlice } from '@reduxjs/toolkit' 

const initialState = {
    // Array of all cakes, indexed by cake.id (sparse array)
    cakes: [],
    // Object grouping cakes by their category_id: { [categoryId]: Cake[] }
    orderedCakes: {},
    // Array of categories, typically sorted by rank
    rankedCategories: [],
    // Object grouping categories by their id: { [id]: Category[] }
    orderedCategories: {}
}

const cakesSlice = createSlice({
    name: "cakes",
    initialState,
    reducers: {
        /**
         * Adds cakes to the state.
         * Populates `cakes` sparse array and groups them into `orderedCakes` by category.
         * @param {Object} action.payload - The action object containing the array of cakes.
         */
        addCakes: (state, action) => {
            const newCakes = []
            action.payload.forEach(cake => {
                newCakes[cake.id] = cake
            })
            state.cakes = newCakes
            
            // Group cakes by category_id
            action.payload.forEach(cake => {
                if (!state.orderedCakes[cake.category_id]) {
                    state.orderedCakes[cake.category_id] = []
                }
                state.orderedCakes[cake.category_id].push(cake)
            })

        },
        /**
         * Adds categories to the state.
         * Sets `rankedCategories` and maps them into `orderedCategories`.
         * @param {Object} action - The action object containing the array of categories.
         */
        addCategories: (state, action) => {
            let cats = []
            action.payload.forEach(cat => {
                cats[cat.rank] = cat
            }) 
            cats = cats.filter(Boolean)
            
            state.rankedCategories = action.payload
            
            // Map categories by their ID
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

export const getCakeImgById = (state, id) => state.cakes.cakes[id]["imgs"][0]