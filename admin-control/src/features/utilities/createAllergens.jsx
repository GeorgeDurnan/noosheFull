/**
 * Component to display a list of allergens for product previews.
 * Ported from the main customer-facing application to ensure visual consistency.
 * 
 * @param {Object} props
 * @param {Array} props.allergens - Array of allergen objects to display (each containing value and label).
 */
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