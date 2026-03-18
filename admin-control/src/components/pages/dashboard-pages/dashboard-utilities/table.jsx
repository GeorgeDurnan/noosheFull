/**
 * Component to create a table for the data
 * Renders a table that includes a delete button for each value
 * 
 * @param {Object} props
 * @param {Array} props.table - The data to populate the table (Array of Objects)
 * @param {Function} props.setMsg - State setter for the feedback message.
 * @param {string|number} props.userId - The current users ID so they can't delete themselves
 */
import { Delete } from "./delete"
export const Table = ({ table, setMsg, userId }) => {
    if (!table) {
        return
    }
    const headers = Object.keys(table[0])
    let data = ""
    return (
        <table>
            <thead>
                <tr>
                    {headers.map((title) => {
                        return <th key={title}>{title}</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {table.map((entry) => {
                    { data = Object.values(entry) }

                    return (<tr key={entry["id"] + "row"}>{data.map((element) => {
                        return <td key={JSON.stringify(element)}>{JSON.stringify(element)}</td>
                    })}
                        <td>
                            <Delete id={entry["id"]} setMsg={setMsg} userId={userId} />
                        </td>
                    </tr>)
                })}
            </tbody>
        </table>
    )
}