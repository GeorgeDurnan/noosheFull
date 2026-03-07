import { useEffect, useState } from "react"
import { Table } from "../dashboard-utilities/table"
export const OrderItems = ({id}) => {
    const [table, setTable] = useState()
    const [count, setCount] = useState()
    const [msg, setMsg] = useState()
    const [show, setShow] = useState(false)
    function handleClick(event) {
        setShow(prev => !prev)
    }
    useEffect(() => {
        async function getTable() {
            const options = {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'

            }
            const response = await fetch(`http://localhost:5000/orders/items/${id}`, options)
            const data = await response.json()
            setTable(data)
        }
        getTable()
    }, [])
    return (
        <>
            <button value={id} onClick={handleClick}>See order items</button>
            {show && <Table table={table["items"]} setMsg={setMsg} setCount={setCount} pk={id} />}
        </>
    )
}