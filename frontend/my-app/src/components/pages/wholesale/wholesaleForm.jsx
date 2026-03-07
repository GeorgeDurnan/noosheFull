import { useState } from "react"
import { SERVER_BASE_URL } from "../../../config"
export const WholesaleForm = ({ setMsg, setShow }) => {
    const [wsForm, setWsForm] = useState({})
    const url = SERVER_BASE_URL
    function handleChange(e) {
        setWsForm(prev => ({ ...prev, [e.target.name]: e ? e.target.value : "" }))
    }
    async function handleSubmit(e) {
        e.preventDefault()
        const response = await fetch(url + "wholesale", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(wsForm),
            credentials: 'include'
        });
        if (response.status == 200) {
            setMsg("Thanks for your inquiry we will respond as soon as we can")
        } else {
            setMsg("Something went wrong please refresh and try again")
        }
        const text = await response.json()
        setShow(false)
    }

    return (<form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="name">Full Name/Business Name</label>
            <input type="text" required name="name" id="name" onChange={handleChange} value={wsForm["name"] || ""} />
            <label htmlFor="contactPerson">Contact Person</label>
            <input type="text" required name="contactPerson" id="contactPerson" onChange={handleChange} value={wsForm["contactPerson"] || ""} />
            <label htmlFor="email">Email Address</label>
            <input type="email" required name="email" id="email" onChange={handleChange} value={wsForm["email"] || ""} />
        </div>
        <div>
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" pattern="\+*\(?[0-9]{1,4}\)?[\-\s\.\/0-9]*" placeholder="phone" required name="phone" id="phone" onChange={handleChange} value={wsForm["phone"] || ""} />
            <label htmlFor="address">Delivery Address</label>
            <input type="address" required name="address" id="address" onChange={handleChange} value={wsForm["address"] || ""} />
        </div>
        <label htmlFor="textbox">General Information (business/event type, products of interest, estimated order size, or any notes)</label>
        <input type="textbox" required name="textbox" id="textbox" onChange={handleChange} value={wsForm["textbox"] || ""} />
        <input type="submit" />
    </form>)
}