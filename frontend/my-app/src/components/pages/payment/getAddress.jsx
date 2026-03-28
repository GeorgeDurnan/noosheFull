import { useState } from "react"
import { useDispatch } from "react-redux"
import { SERVER_BASE_URL } from "../../../config"
import { setFullAddress } from "../../../features/slices/addressSlice"
import styles from "./addressCheckout.module.css"
/**
 * Component to capture and validate user delivery address.
 * @param {Object} props - The component props.
 * @param {Function} props.setMsg - Function to set feedback messages.
 */
export const GetAddress = ({ setMsg }) => {
    const url = SERVER_BASE_URL
    const [addressHere, setAddressHere] = useState({ postcode: "", })
    const dispatch = useDispatch()
    
    // List of allowed postcode areas for delivery
    const postcodes = ["M", "BL", "OL", "SK", "WA", "WN", "BB", "FY", "L", "LA", "PR", "CH", "CW", "LL", "BD", "HG", "LS", "S", "WF"]
    
    /**
     * Checks if the provided postcode starts with an allowed area code.
     * @param {string} postcode - The postcode to validate.
     * @returns {boolean} - True if the postcode area is allowed, false otherwise.
     */
    function checkPostCode(postcode) {
        let code = postcode.slice(0, 2)
        // If the second character is a number, it's a single-letter area code (e.g., M1)
        if (Number(code[1])) {
            code = code.slice(0, 1)
        }
        code = code.toUpperCase()
        for (const combo of postcodes) {
            if (code == combo) {
                return true
            }
        }
        return false
    }

    /**
     * Submit handler for the address form.
     * Validates the postcode against the allowed list and postcodes.io API.
     * Submits the address to the backend if valid.
     * @param {Event} event - The form submission event.
     */
    async function handleSubmit(event) {
        event.preventDefault()

        try {
            // Check if postcode is in allowed area and country is selected
            if (checkPostCode(addressHere?.postcode) && addressHere?.country) {
                // Verify postcode validity with external API
                const response = await fetch(`https://api.postcodes.io/postcodes/${addressHere.postcode}`)
                if (response.status !== 200) {
                    setMsg("Postcode is invalid")
                    return
                }
                console.log(response)
                
                // Post address to backend
                const response2 = await fetch(`${url}address`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ "line_one": addressHere.line1, "line_two": addressHere.line2, "city": addressHere.city, "postcode": addressHere.postcode }),
                    credentials: 'include'
                }) 
                console.log(response2)
                
                if (response2.status !== 201) {
                    setMsg("Something went wrong with address please try again")
                    return
                }
                const text = await response2.json()
                console.log(text)
                
                // Update Redux state with the new address
                const newAddress = { ...addressHere }
                newAddress.id = text.id
                setMsg("Address added correctly" + text.id)
                dispatch(setFullAddress(newAddress))
                return
            }
            setMsg("Invalid address ")
        } catch (e) {
            setMsg("Apologies there was a network error please refresh if the problem persists please contact system administrator ")
        }



    }
    
    /**
     * Updates local state on input change.
     * @param {Event} e - The input change event.
     */
    function handleChange(e) {
        setAddressHere(prev => ({ ...prev, [e.target.name]: e ? e.target.value : "" }))
    }

    return (
        <>

            <form className={styles.form} onSubmit={handleSubmit}>
                <h2>Where would you like your cakes to be delivered?</h2>
                <label htmlFor="line1">Address line 1</label>
                <input type="text" required name="line1" id="line1" onChange={handleChange} value={addressHere["line1"] || ""} />
                <label htmlFor="line2">Address line 2</label>
                <input type="text" name="line2" id="line2" onChange={handleChange} value={addressHere["line2"] || ""} />
                <label htmlFor="city">City</label>
                <input type="text" required name="city" id="city" onChange={handleChange} value={addressHere["city"] || ""} />
                <label htmlFor="">Country</label>
                <select required name="country" id="country" onChange={handleChange} value={addressHere["country"] || ""} >
                    <option value="" disabled> -- select an option -- </option>
                    <option value={true}>United Kingdom</option>
                    <option value={false}>Rest of world</option>
                </select>
                <label htmlFor="postcode">Postcode</label>
                <input required name="postcode" id="postcode" onChange={handleChange} value={addressHere["postcode"] || ""} />
                <button>Submit</button>
            </form>
        </>
    )
}

