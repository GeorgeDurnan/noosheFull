/**
 * Utility function to create a new option category for a product in the database.
 * 
 * @param {Object} cat - The category object containing details like description, rank etc.
 * @param {boolean} [cat.multiple] - Whether multiple options can be selected.
 * @param {string} cat.description - Name/Description of the category.
 * @param {number} cat.rank - Display order rank.
 * @param {boolean} [cat.required] - Whether a selection in this category is required.
 * @param {string|number} product_id - The ID of the product this category belongs to.
 * @returns {Promise<string|number>} The ID of the newly created category.
 */
export const postCat = async (cat, product_id) => {
    const body = {
        "multiple": cat["multiple"] || false,
        "description": cat["description"],
        "rank": cat["rank"],
        "required": cat["required"] || false,
        "product_id": product_id

    }
    const options = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)

    }


    const response = await fetch(`http://localhost:5000/categories`, options)
    console.log("category response" + response )
    const data = await response.json()
    if (response.status == 500) {
        console.log("Category not added error" + data)
    } else {
        console.log(data)
    }

    return(data.id)
}