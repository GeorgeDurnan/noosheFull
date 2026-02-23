import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_BASE_URL } from "../../config"
import { addCakes } from "../slices/cakeSlice";
import { getCakeImgs } from "./getCakeImgs";
import { getCakeAllergens } from "./getCakeAllergens";
import { getCakeCats } from "./getCakesCats";
import { addCategories } from "../slices/cakeSlice";
export const useGetCakes = () => {
    const dispatch = useDispatch();
    const url = SERVER_BASE_URL
    console.log("get cakes called")
    useEffect(() => {
        async function getCakes() {
            try {
                const imgs = await getCakeImgs()
                const allergens = await getCakeAllergens()
                const categories = await getCakeCats()
                const response = await fetch(url + "products");
                const text = await response.json();
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