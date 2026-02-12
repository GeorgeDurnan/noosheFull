import { useState, useEffect } from "react"
import { Table } from "../dashboard-utilities/table"
import { AddItem } from "../dashboard-utilities/addItem"
import { useLocation } from "react-router-dom"
export const Users = ({ output }) => {
    const [table, setTable] = useState()
    const [count, setCount] = useState(0)
    const [msg, setMsg] = useState("")
    const location = useLocation();
    const {userId} = location.state || {};
    console.log(userId)
    useEffect(() => {
        async function getTable() {
            const options = {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'

            }
            const response = await fetch(`http://localhost:5000/users`, options)
            const data = await response.json()
            setTable(data)
        }
        getTable()
    }, [count])

    if (!table) {
        return <h1>Loading...</h1>
    } else {
        return (<>
            <Table table={table} setCount={setCount} setMsg={setMsg} pk ={userId} />
            <AddItem inputs={{ username: true, password: true }} setCount={setCount} setMsg={setMsg} msg={msg} />
            <a href="/dashboard">Dashboard</a>
        </>
        )
    }

}