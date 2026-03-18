import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
/**
 * Component to handle communicating with database to add a new user.
 * Renders a form based on input configuration and posts the collected data.
 * Currently only designed for user as it has hard coded api link but could be changed to make more universal
 * 
 * @param {Object} props
 * @param {Object} props.inputs - input definitions/configuration (keys are field names, values dictate if required)
 * @param {Function} props.setCount - state setter to trigger updates in the parent component
 * @param {Function} props.setMsg - state setter for the feedback message
 */
export const Options = ({ inputs, setMsg, setCount }) => {
    const keys = Object.keys(inputs)
    const [values, setValues] = useState({})

    // Handle form submission: constructs data object and sends POST request
    function handleSubmit(event) {
        event.preventDefault()
        async function createItem() {
            const body = {}
            keys.forEach((element) => {
                body[element] = values[element]
            })
            const options = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(body)

            }


            const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, options)
            if (process.env.REACT_APP_POSTRESPONSE === "true") {
                console.log(response)
            }
            const data = await response.json()
            if (response.status == 404) {
                setMsg("User not added error " + data)
            } else {
                setMsg(data)
                setCount(prev => prev + 1)
            }
        }
        createItem()
    }
    return (<>
        <form onSubmit={handleSubmit}>
            {/* Dynamically generate inputs based on keys in the inputs prop */}
            {keys.map((key) => {
                return (
                    <div key={key}>
                        <label htmlFor={key}>{key}</label>
                        <input
                            type="text" required={inputs[key]} id={key} name={key} value={values[key] || ''} onChange={(e) => setValues(prev => ({ ...prev, [key]: e.target.value }))} />
                    </div>
                )
            })}
            <input type="submit" />
        </form>
    </>
    )
}
