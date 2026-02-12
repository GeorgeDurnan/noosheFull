import { useState } from "react"
import { Options } from "../users/userOptions"
export const AddItem = ({ inputs , setCount, msg, setMsg}) => {
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