import { Change } from "./users/changePassword"
import { useState } from "react"
import { useLocation } from "react-router-dom"
/**
 * Component to display the user's profile page.
 * Displays the username retrieved from navigation state and allows the user to change their password.
 */
export const Profile = () => {
    const location = useLocation() 
    const { name } = location.state || {} 
    const [show, setShow] = useState(false)
    const [msg, setMsg] = useState("")
    function handleClick() {
        setShow(prev => !prev)
    }
    return (
        <div>
            <h1>{name}'s profile</h1>
            <button onClick={handleClick}>Change password</button>
            {show && <Change name={name} setShow={setShow} setMsg={setMsg} />}
            <h1>{msg}</h1>
            <a href="/dashboard">dashboard</a>
        </div>
    )
}