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
            <div className="allergens">
                {allergenNames.map((allergen) => {
                    if (!allergens[allergen.value]) {
                        return
                    } else {
                        return (<div key={allergen.value} className="allergen">
                            <img className="allergenImg" src={`/images/allergenicons/${allergen.value}2.png`} alt="allergen img not found" />
                            {labels && <h1 className="allergenLabel">{allergen.label}</h1>}
                        </div>)
                    }


                })}
            </div>
        )
    }


}
