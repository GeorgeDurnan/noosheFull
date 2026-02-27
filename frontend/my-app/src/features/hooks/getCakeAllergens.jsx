import { SERVER_BASE_URL } from "../../config"
export const getCakeAllergens = (async () => {
    const url = SERVER_BASE_URL
    const allergens = [
        { value: "lactose", label: "Lactose" },
        { value: "eggs", label: "Eggs" },
        { value: "fish", label: "Fish" },
        { value: "molluscs", label: "Molluscs" },
        { value: "tree_nuts", label: "Tree Nuts" },
        { value: "peanuts", label: "Peanuts" },
        { value: "gluten", label: "Gluten" },
        { value: "soy", label: "Soy" },
        { value: "sesame", label: "Sesame" },
        { value: "sulphides", label: "Sulphides" },
        { value: "mustard", label: "Mustard" },
        { value: "lupin", label: "Lupin" },
        { value: "crustaceans", label: "Crustaceans" },
        { value: "celery", label: "Celery" },
        { value: "gluten_free", lable: "Gluten Free" }
    ];
    const options = {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const response = await fetch(url + "allergens/", options);
        console.log(response)
        const text = await response.json();
        const namedAllergens = {}
        text.forEach(allergenList => {
            const placeholder = allergenList.product_id
            delete allergenList.product_id
            namedAllergens[placeholder] = allergenList
        });
        return (namedAllergens)
    } catch (e) {
        console.log("Failed to  cake allergens" + e)
        return ([])
    }
})