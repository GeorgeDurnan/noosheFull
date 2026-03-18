import { useEffect, useState } from "react"
import { Table } from "../dashboard-utilities/table"
/**
 * Component to display the items for a specific order
 * Fetches from the server then displays it using another react component
 * 
 * @param {Object} props
 * @param {number|string} props.id - The ID of the order to be displayed.
 */
export const OrderItems = ({ id }) => {
    // State to hold the order items data fetched from the API
    const [table, setTable] = useState()
    // State to manage messages (e.g. success/error feedbacks) currently not used 
    const [msg, setMsg] = useState()
    // State to toggle the visibility of the items table
    const [show, setShow] = useState(false)

    //Toggles visibility of the order table
    function handleClick() {
        setShow(prev => !prev)
    }

    //Fetch order items when the component mounts
    useEffect(() => {
        async function getTable() {
            const options = {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'

            }
            const response = await fetch(`${process.env.REACT_APP_API_URL}/orders/items/${id}`, options)
            
            // Log response for debugging if environment variable is set
            if (process.env.REACT_APP_POSTRESPONSE === "true") {
                console.log(response)
            }
            const data = await response.json()
            setTable(data)
        }
        getTable()
    }, [id])
    return (
        <>
            <button value={id} onClick={handleClick}>See order items</button>
            {show && <Table table={table["items"]} setMsg={setMsg} userId={id} />}
        </>
    )
}