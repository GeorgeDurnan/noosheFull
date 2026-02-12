import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
export const Options = ({ inputs, setMsg , setCount}) => {
    const keys = Object.keys(inputs)
    const navigate = useNavigate()
    const [values, setValues] = useState({})
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


            const response = await fetch(`http://localhost:5000/signup`, options)
            console.log(response)
            const data = await response.text()
            console.log(JSON.stringify(data) + "--here")
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
