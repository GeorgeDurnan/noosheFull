import { GetAddress } from "./getAddress"
import { useState } from "react"
import styles from "./addressCheckout.module.css"

/**
 * AddressCheckout Component
 * 
 * Container for the address selection/entry during checkout.
 * Displays a status message below the address form.
 */
export const AddressCheckout = () => {
    // State to hold status messages from the GetAddress component
    const [msg, setMsg] = useState("")

    return (
        <div className={`${styles.address} address`}>
            <GetAddress setMsg={setMsg}/>
            <h1>{msg}</h1>
        </div>
    )
}