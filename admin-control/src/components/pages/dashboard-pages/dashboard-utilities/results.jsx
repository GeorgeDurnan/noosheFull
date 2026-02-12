export const Results = ({ output }) => {
    const headers = Object.keys(output[0])
    let data = ""
    return (
        <table>
            <tr>
                {headers.map((title) => {
                    return <th>{title}</th>
                })}
            </tr>
            {output.map((entry) => {
                { data = Object.values(entry) }

                return (<tr>{data.map((element) => {
                    return <td>{element}</td>
                })}
                </tr>)
            })}
        </table>
    )

}
<table>
    <tr>
        <th>Company</th>
        <th>Contact</th>
        <th>Country</th>
    </tr>
    <tr>
        <td>Alfreds Futterkiste</td>
        <td>Maria Anders</td>
        <td>Germany</td>
    </tr>
    <tr>
        <td>Centro comercial Moctezuma</td>
        <td>Francisco Chang</td>
        <td>Mexico</td>
    </tr>
</table> 