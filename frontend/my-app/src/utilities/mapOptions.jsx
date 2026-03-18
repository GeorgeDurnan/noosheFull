import { useState, useEffect } from "react"
import styles from "../components/item.module.css"

/**
 * MapOptions Component
 * Renders a list of product options (radio buttons or checkboxes) and manages price updates.
 * 
 * @param {Object} props
 * @param {Array} props.optionCats - Array of option categories to display
 * @param {Object} props.sortedOptions - Object containing options grouped by category ID
 * @param {number|string} props.price - The current total price
 * @param {Function} props.setPrice - State setter for updating the total price
 * @param {number} props.basePrice - The initial base price of the item
 * @param {Object} props.chosenOptions - State object containing currently selected options
 * @param {Function} props.setChosenOptions - State setter for selected options
 * @param {Object} props.item - The current item object being customized
 */
export const MapOptions = ({ optionCats, sortedOptions, price, setPrice, basePrice, chosenOptions, setChosenOptions, item }) => {
    // Tracks the price of the previously selected radio option to correctly calculate price swaps
    const [currentBasePrice, setCurrentBasePrice] = useState(basePrice)
    
    // Set default selections for required categories so the first option is pre-selected
    useEffect(() => {
        const newDefaults = {}
        optionCats.forEach((cat) => {
            const optionsForCat = sortedOptions?.[cat["id"]] || [] 
            if (cat["required"] && optionsForCat.length > 0) {
                newDefaults[cat["description"]] = {value: optionsForCat[0]["description"], option: optionsForCat[0]} 
            }
        }) 
        setChosenOptions(newDefaults)
    }, [item, optionCats]) 

    function handleChange(e) {
        const addOnPrice = Number(e.target.dataset.price || 0)
        
        if (e.target.type === "checkbox") {
            // Handle multiple-choice options: add or subtract price based on checked state
            setChosenOptions((prev) => ({ ...prev, [e.target.name]: {value: e.target.name, option: JSON.parse(e.target.dataset.option)} }))
            if (e.target.checked) {
                setPrice(prev => (Number(prev) + addOnPrice).toFixed(2))
            } else {
                setPrice(prev => (Number(prev) - addOnPrice).toFixed(2))
            }

        } else {
            // Handle single-choice options: swap price by removing previous selection's cost and adding new one
            setChosenOptions((prev) => ({ ...prev, [e.target.name]: {value: e.target.value, option: JSON.parse(e.target.dataset.option)} }))
            setPrice(prev => ((Number(prev) - Number(currentBasePrice)) + Number(addOnPrice)).toFixed(2))
            setCurrentBasePrice(addOnPrice)
        }
        
    }
    return (<form action="">
        {optionCats.map((cat) => {
            if (!cat?.description) return null
            const optionsForCat = (sortedOptions && sortedOptions[cat["id"]]) || []

            return (
                <div key={cat["id"]}>
                    <h1>{cat["description"]}</h1>
                    {
                        optionsForCat.map((option) => {
                            // Checkbox inputs for categories allowing multiple selections
                            if (cat["multiple"] == true) {
                                return (
                                    <div key={option["description"]}>
                                        <label htmlFor={option["description"]}>
                                            <input type="checkbox"
                                                name={option["description"]}
                                                onChange={handleChange}
                                                data-price={option["price"]}
                                                data-option={JSON.stringify(option)}
                                                checked={chosenOptions[option["description"]]?.value || false} />
                                            {option["description"]} {option["price"] ? `(+£${option["price"]})` : "Free"}
                                        </label>
                                        <br />
                                    </div>
                                )
                                
                            } else {
                                // Radio inputs for categories requiring a single selection
                                return (<div key={option["description"]}>
                                    <label htmlFor={cat["description"]}>
                                        <input
                                            type="radio"
                                            name={cat["description"]}
                                            value={option["description"]}
                                            data-price={option["price"]}
                                            data-option={JSON.stringify(option)}
                                            checked={chosenOptions[cat["description"]]?.value === option["description"]}
                                            onChange={handleChange}
                                        /> {option["description"]} {option["price"] ? `(£${option["price"]})` : "Free"}
                                    </label>
                                    <br />
                                </div>
                                )
                            }
                        })
                    }
                </div>)
        })}
    </form>)

}