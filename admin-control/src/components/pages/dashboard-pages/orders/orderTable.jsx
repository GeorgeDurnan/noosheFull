import { OrderItems } from "./orderItems"
/**
 * Component to handle displaying the order table
 * Also attaches an order item component to each so the order items can be viewed
 * 
 * @param {Object} props
 * @param {Array} props.table - The order data from the API
 */
export const OrderTable = ({ table}) => {
    const headers = Object.keys(table[0])
    let data = ""
    return (
        <table>
            <thead>
                <tr>
                    {headers.map((title) => (
                        <th key={title}>{title}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {table.map((entry) => {
                    data = Object.values(entry) 
                    return (
                        <>
                            <tr key={entry["id"] + "row"}>
                                {data.map((element) => (
                                    <td key={element}>{element}</td>
                                ))}
                            </tr>
                            <tr key={entry["id"] + "orderItems"}>
                                <td colSpan={headers.length}>
                                    {console.log(entry["id"])}
                                    {console.log(JSON.stringify(entry))}
                                    <OrderItems id={entry["id"]} />
                                </td>
                            </tr>
                        </>
                    ) 
                })}
            </tbody>
        </table>
    ) 
}

