import { ProductTable } from "./productTable"
import { useState } from "react"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { AddProduct } from "./addProduct/addProduct"
export const Products = () => {
    const [table, setTable] = useState()
    const [count, setCount] = useState(0)
    const [msg, setMsg] = useState("")
    const location = useLocation();
    const { userId } = location.state || {};
    useEffect(() => {
        async function getTable() {
            const options = {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'

            }
            const response = await fetch(`http://localhost:5000/products`, options)
            const data = await response.json()
            setTable(data)
        }
        getTable()
    }, [count])

    if (!table) {
        return <h1>Loading...</h1>
    } else {
        return (<>
            <ProductTable table={table} setCount={setCount} setMsg={setMsg} pk={"eh"} />
            <h1>{msg}</h1>
            <AddProduct setCount={setCount} setMsg={setMsg}/>
            <a href="/dashboard">Dashboard</a>
        </>
        )
    }

}