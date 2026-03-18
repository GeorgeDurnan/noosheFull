import { Allergies } from "../images/svgs/allergies" 
import style from "../components/pages/shop.module.css"
import allergenStyle from "./allergens.module.css"

/**
 * Renders a list of allergen icons with optional labels.
 * 
 * @param {Object} props
 * @param {Object} props.allergens - Object map where keys corresponding to allergen names (e.g., 'lactose', 'eggs') have truthy values if the allergen is present.
 * @param {boolean} [props.labels=true] - Flag to toggle display of text labels alongside icons. Defaults to true.
 */
export const CreateAllergens = ({ allergens, labels = true }) => {
    const allergenNames = [
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
        { value: "gluten_free", label: "Gluten Free" }
    ] 

    if (!allergens) {
        return <h1>No allergen selected</h1>
    } else {
        return (
            <div className={allergenStyle.allergens}>
                {/* Map through defined allergens and display icon/label if active in props */}
                {allergenNames.map((allergen) => {
                    if (!allergens[allergen.value]) {
                        return null
                    } else {
                        return (<div key={allergen.value} className={allergenStyle.allergen}>
                            <div className={style.icon}>
                                <Allergies allergen={allergen.value} />
                            </div>
                            {labels && <h1 className="allergenLabel">{allergen.label}</h1>}
                        </div>)
                    }


                })}
            </div>
        )
    }


}
