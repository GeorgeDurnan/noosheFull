import { useState } from "react"
/**
 * Component to handle changing a password of a user
 * 
 * @param {Object} props
 * @param {Function} props.setShow - State setter for showing/hiding the component.
 * @param {Function} props.setMsg - State setter for the feedback message.
 * @param {string} props.name - Username of the current user.
 */
export const Change = ({ setShow, setMsg, name }) => {
    const [oldPass, setOldPass] = useState("")
    const [newPass, setNewPass] = useState("")
    async function handleSubmit(event) {
        event.preventDefault()
        if (oldPass == newPass) {
            setMsg("Old password is same as new one please choose a new password")
            return
        }
        const response1 = await fetch(`${process.env.REACT_APP_API_URL}/check`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ "username": name, "password": oldPass })

        })
        if (process.env.REACT_APP_POSTRESPONSE === "true") {
            console.log(response)
        }
        if (response1.status !== 200) {
            setMsg("old Password incorrect")
            return
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/change`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ "username": name, "password": newPass })

        })
        if (process.env.REACT_APP_POSTRESPONSE === "true") {
            console.log(response)
        }
        const text = await response.json()
        setMsg(text)
        setShow(prev => !prev)
    }
    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="oldPass">Old password</label>
            <input type="text" required id="oldPass" name="oldPass" value={oldPass} onChange={(e) => setOldPass(e.target.value)} />
            <label htmlFor="newPass">New password</label>
            <input type="text" required id="newPass" name="newPass" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
            <input type="submit" />
        </form>

    )
}