import { OrderTable } from "./orderTable"
import { useState } from "react"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"
export const Orders = () => {
    const [table, setTable] = useState()
    const [count, setCount] = useState(0)
    const [msg, setMsg] = useState("")
    const location = useLocation();
    useEffect(() => {
        async function getTable() {
            const options = {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'

            }
            const response = await fetch(`http://localhost:5000/orders`, options)
            const data = await response.json()
            setTable(data)
        }
        getTable()
    }, [count])

    if (!table) {
        return <h1>Loading...</h1>
    } else {
        return (<>
            <OrderTable table={table} setCount={setCount} setMsg={setMsg} pk={"eh"} />
            <h1>{msg}</h1>
            <a href="/dashboard">Dashboard</a>
        </>
        )
    }

}