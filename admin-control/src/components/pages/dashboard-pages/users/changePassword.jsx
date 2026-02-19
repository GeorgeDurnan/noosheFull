import { useState } from "react"
export const Change = ({ setShow, setMsg, name }) => {
    const [oldPass, setOldPass] = useState("")
    const [newPass, setNewPass] = useState("")
    async function handleSubmit(event) {
        event.preventDefault()
        if (oldPass == newPass) {
            setMsg("Old password is same as new one please choose a new password")
            return
        }
        const response1 = await fetch("http://localhost:5000/check", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ "username": name, "password": oldPass })

        })
        if(response1.status !== 200){
            setMsg("old Password incorrect")
            return
        }
        const response = await fetch("http://localhost:5000/change", {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ "username": name, "password": newPass })

        })
        const text = await response.text()
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