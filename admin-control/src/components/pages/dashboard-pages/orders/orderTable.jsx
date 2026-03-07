import { useState } from "react"
import { deleteElement } from "../../../../features/utilities/upload/delete"
import { OrderItems } from "./orderItems"
export const OrderTable = ({ table, setMsg, setCount, pk }) => {
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
                    data = Object.values(entry);
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
                    );
                })}
            </tbody>
        </table>
    );
}

