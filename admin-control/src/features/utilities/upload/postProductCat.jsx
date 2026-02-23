export const postProductCat = async (cat) => {
    const body = {
        "description": cat.description,
        "rank": cat.rank

    }
    const options = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)

    }


    const response = await fetch(`http://localhost:5000/cakeCats`, options)
    return (response)
}  