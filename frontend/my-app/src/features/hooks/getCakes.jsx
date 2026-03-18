import { useEffect } from "react" 
import { useDispatch, useSelector } from "react-redux" 
import { SERVER_BASE_URL } from "../../config"
import { addCakes } from "../slices/cakeSlice" 
import { getCakeImgs } from "./getCakeImgs" 
import { getCakeAllergens } from "./getCakeAllergens" 
import { getCakeCats } from "./getCakesCats" 
import { addCategories } from "../slices/cakeSlice" 

/**
 * Custom hook to fetch cake data including images, allergens, and categories.
 * Dispatches the combined data to the Redux store.
 */
export const useGetCakes = () => {
    const dispatch = useDispatch() 
    const url = SERVER_BASE_URL

    useEffect(() => {
        /**
         * Fetches all necessary data from the backend and constructs the cake objects.
         */
        async function getCakes() {
            try {
                const options = {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }

                // Fetch auxiliary data (images, allergens, categories)
                const imgs = await getCakeImgs()
                const allergens = await getCakeAllergens()
                const categories = await getCakeCats()

                // Fetch main product list
                const response = await fetch(url + "products", options) 
                const text = await response.json() 

                // Combine product data with auxiliary data
                const cakes = text.map((cake) => {
                    return {
                        id: cake.id,
                        name: cake.name,
                        description: cake.description,
                        price: cake.price,
                        category_id: cake.category_id,
                        category: categories[cake.category_id],
                        imgs: imgs[cake.id] || [],
                        allergens: allergens[cake.id] || []
                    }
                })

                dispatch(addCakes(cakes))
                dispatch(addCategories(categories))
            } catch (e) {
                console.log("Failed to fetch cakes" + e)
                return
            }
        }
        getCakes()
    }, [])
}