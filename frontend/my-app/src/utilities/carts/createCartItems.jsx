import { useSelector } from "react-redux"
import { getCart } from "../../features/slices/cartSlice"
import { getCakes } from "../../features/slices/cakeSlice"
export const useCreateCartItems = () => {
    const cakes = useSelector(getCakes)
    console.log("Create cart items: " + JSON.stringify(cakes))
    const cart = useSelector(getCart)
    console.log("cart" + JSON.stringify(cart))
    function getTotalPrice(options) {
        let price = 0
        Object.values(options)?.forEach((option) => {
            try {
                price += Number(option["option"]["price"])

            } catch (e) {
                console.log("Something went wrong with getting the price" + JSON.stringify(option))
            }
        })
        return price
    }
    if(!cakes || Object.values(cakes).length == 0 || !cart || Object.values(cart).length == 0){
        return("loading")
    }
    const arranged = Object.values(cart).map((item) => {
        console.log("price: " + getTotalPrice(item["options"]))
        console.log("Quantity: " + item["quantity"])
        console.log("options:" + Object.values(item["options"]).map((option) => { return option.value }))
        console.log("cake_name:" + cakes[item["product_id"]].name)
        return {
            price: getTotalPrice(item["options"]),
            quantity: item["quantity"],
            optionsFlat: Object.values(item["options"]).map((option) => { return option.value }),
            name: cakes[item["product_id"]].name,
            img: cakes[item["product_id"]]["imgs"][0]["url"],
            product_id: item["product_id"],
            options: item["options"],
            id: item["id"]

        }
    })
    console.log("arranged" + JSON.stringify(arranged))
    if (arranged.length > 0) {
        return (arranged)
    }else{
        return("loading")
    }


}