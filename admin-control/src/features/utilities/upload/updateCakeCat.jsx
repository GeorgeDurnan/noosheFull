export const updateEntry = async (body, id, link ) => {
    const options = {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)

    }


    const response = await fetch(`http://localhost:5000/${link}/${id}`, options)
    return response
}