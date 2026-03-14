import { GetAddress } from "./getAddress"
import { useState } from "react"
import styles from "./addressCheckout.module.css"
export const AddressCheckout = () => {
    const [msg, setMsg] = useState("")
    return (
        <div className={`${styles.address} address`}>
            <GetAddress setMsg={setMsg}/>
            <h1>{msg}</h1>
        </div>
    )
}