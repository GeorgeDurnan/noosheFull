import { useState, useEffect } from "react"
export const MapOptions = ({ optionCats, sortedOptions, price, setPrice, basePrice, chosenOptions, setChosenOptions, item }) => {
    const [currentBasePrice, setCurrentBasePrice] = useState(basePrice)
    //Just sets the defaults for the page so the first radio option is chosen
    useEffect(() => {
        const newDefaults = {}
        optionCats.forEach((cat) => {
            const optionsForCat = sortedOptions?.[cat["id"]] || [];
            if (cat["required"] && optionsForCat.length > 0) {
                newDefaults[cat["description"]] = {value: optionsForCat[0]["description"], option: optionsForCat[0]};
            }
        });
        setChosenOptions(newDefaults)
    }, [item, optionCats]);
    function handleChange(e) {
        const addOnPrice = Number(e.target.dataset.price || 0)
        if (e.target.type === "checkbox") {
            setChosenOptions((prev) => ({ ...prev, [e.target.name]: {value: e.target.name, option: JSON.parse(e.target.dataset.option)} }))
            if (e.target.checked) {
                setPrice(prev => (Number(prev) + addOnPrice).toFixed(2))
            } else {
                setPrice(prev => (Number(prev) - addOnPrice).toFixed(2))
            }

        } else {
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
                            console.log("option in mapOptions in map" + JSON.stringify(option) )
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
                                
                            } else {//If category is required
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