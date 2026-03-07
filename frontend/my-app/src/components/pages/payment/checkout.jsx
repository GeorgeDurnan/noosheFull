import { useCreateCartItems } from "../../../utilities/carts/createCartItems"
import { StripeEmbed } from "./stripe"
import { useSelector } from "react-redux"
import { getFullAddressFromSlice } from "../../../features/slices/addressSlice"
import { AddressCheckout } from "./addressCheckout"
export const Checkout = () => {
    const cart = useCreateCartItems()
    const fullAddress = useSelector(getFullAddressFromSlice)
    
    if (cart === "loading") {
        return (
            <h1>No items</h1>
        )
    } else if (!fullAddress) {
        return (<AddressCheckout/>)
    } else {
        return (
            <StripeEmbed cart={cart} address_id ={fullAddress.id} />
        )
    }

}