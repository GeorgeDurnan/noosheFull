import { postProduct } from "./postProduct"
import { postAllergen } from "./postAllergen"
import { postCat } from "./postCat"
import { postImage } from "./postImage"
import { postOpt } from "./postOpt"
import { deleteElement } from "./delete"
export const upload = async (cake, options, optionCats) => {
    let product_id = null

    try {
        // Filter out empty values
        optionCats = optionCats.filter(Boolean)
        const images = cake["img"].filter(Boolean)

        // 1. Create product post to products table
        product_id = await postProduct(cake)

        // 2. Create option categories linked to the product
        const optionCatsId = await Promise.all(optionCats.map(async (cat) => {
            const id = await postCat(cat, product_id)
            return { ...cat, "id": id }
        }))

        // 3. Create options for each category
        for (const cat of optionCatsId) {
            const opts = cat["description"] || []
            const x = options[opts].filter(Boolean)
            for (const opt of x) {
                await postOpt(opt, cat["id"], product_id)
            }
        }

        // 4. Create allergens
        await postAllergen(cake, product_id)

        // 5. Create images
        for (const image of images) {
            await postImage(product_id, image)
        }
    } catch (e) {
        // Rollback: Delete the product if any step fails to ensure data integrity
        try {
            console.error("Failed to create product, starting rollback: " + e)
            if (product_id) {
                await deleteElement(product_id, "products")
            }
        } catch (err) {
            console.error("Failed to delete product during rollback: " + err)
        }
    }
}