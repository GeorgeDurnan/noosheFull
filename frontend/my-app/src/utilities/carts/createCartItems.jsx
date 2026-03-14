import { useSelector } from "react-redux"
import { getCart } from "../../features/slices/cartSlice"
import { getCakes } from "../../features/slices/cakeSlice"
import { setPrice } from "../../features/slices/cartSlice"
export const useCreateCartItems = () => {
    const cakes = useSelector(getCakes)
    const cart = useSelector(getCart)
    let megaPrice = 0
    function getTotalPrice(options) {
        let price = 0
        Object.values(options)?.forEach((option) => {
            try {
                price += Number(option["option"]["price"])

            } catch (e) {
                console.log("Something went wrong with getting the price" + JSON.stringify(option))
            }
        })
        megaPrice += price
        return price
    }
    if(!cakes || Object.values(cakes).length == 0 || !cart || Object.values(cart).length == 0){
        return("loading")
    }
    const arranged = Object.values(cart)?.map((item) => {
        console.log("in arranged" + JSON.stringify(item))
        return {
            price: getTotalPrice(item["options"]),
            quantity: item["quantity"],
            optionsFlat: Object.values(item["options"]).map((option) => { return option.value }),
            name: cakes[item["product_id"]].name,
            img: cakes[item["product_id"]]["imgs"][0]["url"],
            product_id: item["product_id"],
            options: item["options"],
            id: item["id"],
            extra: item["extra"]

        }
    })
    if (arranged.length > 0) {
        const cart = {arranged: arranged, price: megaPrice}
        return (cart)
    }else{
        return("loading")
    }


}