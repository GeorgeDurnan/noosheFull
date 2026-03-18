import { useState, useEffect } from "react"
import { Table } from "../dashboard-utilities/table"
import { AddUser } from "../dashboard-utilities/addUser"
import { useLocation } from "react-router-dom"
/**
 * Component to display the Users management page.
 * Fetches user data from the API and displays it in a table.
 * Allows adding new users via the AddUser component.
 */
export const Users = () => {
    const [table, setTable] = useState()
    const [count, setCount] = useState(0)
    const [msg, setMsg] = useState("")
    const location = useLocation()
    const { userId } = location.state || {}
    useEffect(() => {
        async function getTable() {
            const options = {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'

            }
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, options)
            if (process.env.REACT_APP_POSTRESPONSE === "true") {
                console.log(response)
            }
            const data = await response.json()
            setTable(data)
        }
        getTable()
    }, [count])

    if (!table) {
        return <h1>Loading...</h1>
    } else {
        return (<>
            <Table table={table} setCount={setCount} setMsg={setMsg} userId={userId} />
            <AddUser inputs={{ username: true, password: true }} setCount={setCount} setMsg={setMsg} msg={msg} />
            <a href="/dashboard">Dashboard</a>
        </>
        )
    }

}