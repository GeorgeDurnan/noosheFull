import { deleteProduct } from "../../../../features/utilities/upload/delete"
export const ProductTable = ({ table, setMsg, setCount, pk }) => {
    const headers = Object.keys(table[0])
    let data = ""
    function handleClick(event){
        setMsg(deleteProduct(event.target.value))
        setCount(prev => prev + 1)
    }
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
                        return <td key={element}>{element}</td>
                    })}
                        <td>
                            <button value ={entry["id"]}onClick={handleClick}>Delete product</button>
                        </td>
                    </tr>)
                })}
            </tbody>
        </table>
    )
}

