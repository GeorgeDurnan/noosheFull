import { useCreateCartItems } from "../../../utilities/carts/createCartItems"
import { StripeEmbed } from "./stripe"
export const Checkout = () => {
    const cart = useCreateCartItems()
    if(cart === "loading"){
        return(
            <h1>No items</h1>
        )
    }else{
        return(
            <StripeEmbed cart={cart}/>
        )
    }

}