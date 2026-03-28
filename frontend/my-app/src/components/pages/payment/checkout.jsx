import { useCreateCartItems } from "../../../utilities/carts/createCartItems"
import { StripeEmbed } from "./stripe"
import { useSelector } from "react-redux"
import { getFullAddressFromSlice } from "../../../features/slices/addressSlice"
import { AddressCheckout } from "./addressCheckout"
import styles from "./addressCheckout.module.css"
import { useEffect } from "react"
/**
 * Checkout Component.
 * 
 * Manages the checkout flow:
 * 1. Waits for cart items to load.
 * 2. Ensures a shipping address is available.
 * 3. Renders the Stripe payment integration.
 */
export const Checkout = () => {
    const cart = useCreateCartItems()
    const fullAddress = useSelector(getFullAddressFromSlice)
    useEffect(()=>{
        console.log("full address" + fullAddress)
    },[fullAddress])
    if (cart === "loading") {
        return (
            <h1>No items</h1>
        )
    } else if (!fullAddress) {
        // Render address form if no address is selected
        return (<AddressCheckout />)
    } else {
        // Proceed to payment with arranged cart and address ID
        return (
            <div className={styles.checkout}>
                <StripeEmbed cart={cart.arranged} address_id={fullAddress.id} />
            </div>
        )
    }

}