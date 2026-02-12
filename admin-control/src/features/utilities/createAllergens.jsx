export const CreateAllergens = ({ allergens }) => {
    if (!allergens) {
        return <h1>No allergen selected</h1>
    }

    return (
        <div className = "allergens">
            {allergens.map((allergen) => {
                return (<div key={allergen.value} className="allergens">
                    <img className = "allergenImg"src={`/icons/${allergen.value}.png`} alt="allergen img not found" />
                    <h1>{allergen.label}</h1>
                </div>)

            })}
        </div>
    )
}