import { Allergies } from "../images/svgs/allergies";
import style from "../components/pages/shop.module.css"
import allergenStyle from "./allergens.module.css"
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
        { value: "gluten_free", lable: "Gluten Free" }
    ];
    const keys = Object.keys(allergens)

    if (!allergens) {
        return <h1>No allergen selected</h1>
    } else {
        return (
            <div className={allergenStyle.allergens}>
                {allergenNames.map((allergen) => {
                    if (!allergens[allergen.value]) {
                        return
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
