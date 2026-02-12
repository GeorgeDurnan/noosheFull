export const getCategories = () => {
    async function categories() {
        const options = {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',

        }


        const response = await fetch(`http://localhost:5000/products/cakes/categories`, options)
        const data = await response.json()
        if (response.status == 404) {
            console.log("no categories found")
            return
        } else {
            return Object.values(data).map(item => item.category)
        }

    }
    return categories()

}