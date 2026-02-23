export const getCategories = () => {
    async function categories() {
        const options = {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',

        }


        const response = await fetch(`http://localhost:5000/cakeCats`, options)
        console.log("Getting categories" + response)
        const data = await response.json()
        if (response.status == 404) {
            console.log("no categories found")
            return
        } else {
            console.log(data.length + " total categories found")
            return Object.values(data)
        }

    }
    return categories()

}