import { postProduct } from "./postProduct"
import { postAllergen } from "./postAllergen"
import { postCat } from "./postCat"
import { postImage } from "./postImage"
import { postOpt } from "./postOpt"
import { deleteProduct } from "./delete"
export const upload = async (cake, options, optionCats) => {
    let product_id = null
    console.log(JSON.stringify(options) + "passed in options")
    try {
        optionCats = optionCats.filter(Boolean)
        //options = options.filter(Boolean)
        const images = cake["img"].filter(Boolean)
        //Create product post to products table
        product_id = await postProduct(cake)
        console.log(product_id + "product id")
        //Create option categories
        const optionCatsId = await Promise.all(optionCats.map(async (cat) => {
            const id = await postCat(cat, product_id)
            return { ...cat, "id": id }
        }))
        //Create options
        for (const cat of optionCatsId) {
            const opts = cat["description"] || []
            console.log(JSON.stringify(opts) + "options here")
            const x = options[opts].filter(Boolean)
            console.log(JSON.stringify(x) + "options filtered here")
            for (const opt of x) {
                await postOpt(opt, cat["id"], product_id)
            }
        }
        //Create allergens
        postAllergen(cake, product_id)
        //Create images
        console.log(JSON.stringify(images))
        for (const image of images) {
            await postImage(product_id, image)
        }
    } catch (e) {
        try {
            console.log("failed to create product deleting all database entries" + e)
            deleteProduct(product_id)
        } catch (err) {
            console.log("Failed to delete product" + err)
        }

    }
}