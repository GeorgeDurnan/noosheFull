import { useState } from "react"
import { Options } from "../users/userOptions"

/**
 * Component to handle adding a new user
 * Toggles a form to input details and displays submission status messages.
 * 
 * @param {Object} props
 * @param {Object} props.inputs - input definitions/configuration passed to the Options component
 * @param {Function} props.setCount - state setter to trigger updates in the parent component
 * @param {string} props.msg - feedback message to display to the user
 * @param {Function} props.setMsg - state setter for the feedback message
 */
export const AddUser = ({ inputs , setCount, msg, setMsg}) => {
    const [open, setOpen] = useState(false)

    function handleClick() {
        setOpen(prev => !prev)
    }
    return(
        <div>
            <button onClick={handleClick}>Add item</button>
            {open && <Options inputs = {inputs} setMsg = {setMsg} setCount = {setCount}/>}
            <h2>{msg}</h2>
        </div>

    )
}