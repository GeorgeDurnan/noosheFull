import { GetAddress } from "./getAddress"
import { useState } from "react"
export const AddressCheckout = () => {
    const [msg, setMsg] = useState("")
    return (
        <>
            <GetAddress setMsg={setMsg}/>
            <h1>{msg}</h1>
        </>
    )
}