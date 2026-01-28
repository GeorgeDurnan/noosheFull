import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_BASE_URL } from "../../config"
import { addCakes } from "../slices/cakeSlice";
export const useGetCakes = () => {
    const dispatch = useDispatch();
    const url = SERVER_BASE_URL
    useEffect(() => {
        async function getCakes() {
            try {
                console.log(url)
                const response = await fetch(url + "products");
                const text = await response.json();
                const cakes = text.map((cake) => {
                    return {
                        id: cake.id,
                        name: cake.name,
                        description: cake.description,
                        price: cake.price,
                        stock: cake.stock,
                        category_id: cake.category_id,
                        made_on_request: cake.made_on_request,
                        image: cake.image
                    }
                })
                dispatch(addCakes(cakes))
            } catch (e) {
                console.log("Failed to fetch cakes" + e)
                return
            }
        }
        getCakes()
    },[])

}