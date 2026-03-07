import { Delete } from "./delete"
export const Table = ({ table, setMsg, setCount, pk }) => {
    if (!table) {
        return
    }
    console.log("table" + JSON.stringify(table))
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
                            <Delete id={entry["id"]} setMsg={setMsg} setCount={setCount} pk={pk} />
                        </td>
                    </tr>)
                })}
            </tbody>
        </table>
    )
}