import { useCreateCartItems } from "../../../utilities/carts/createCartItems"
import { StripeEmbed } from "./stripe"
import { useSelector } from "react-redux"
import { getFullAddressFromSlice } from "../../../features/slices/addressSlice"
import { AddressCheckout } from "./addressCheckout"
import styles from "./addressCheckout.module.css"
import { useEffect } from "react"
export const Checkout = () => {
    const cart = useCreateCartItems()
    const fullAddress = useSelector(getFullAddressFromSlice)
    if (cart === "loading") {
        return (
            <h1>No items</h1>
        )
    } else if (!fullAddress) {
        return (<AddressCheckout />)
    } else {
        return (
            <div className={styles.checkout}>
                <StripeEmbed cart={cart.arranged} address_id={fullAddress.id} />
            </div>
        )
    }

}