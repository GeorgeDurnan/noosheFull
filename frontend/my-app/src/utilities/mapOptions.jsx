import { useState, useEffect } from "react"
export const MapOptions = ({ optionCats, sortedOptions, price, setPrice, basePrice }) => {
    const [order, setOrder] = useState({})
    const [currentBasePrice, setCurrentBasePrice] = useState(basePrice)

    useEffect(() => {
        setOrder({})
        setCurrentBasePrice(basePrice)
        setPrice(Number(basePrice).toFixed(2))
    }, [basePrice, optionCats, sortedOptions])
    useEffect(() => {
        const newDefaults = { ...order };
        let hasChanged = false;

        optionCats.forEach((cat) => {
            const optionsForCat = sortedOptions?.[cat["id"]] || [];
            if (cat["required"] && !order[cat["description"]] && optionsForCat.length > 0) {
                newDefaults[cat["description"]] = optionsForCat[0]["description"];
                hasChanged = true;
            }
        });
        if (hasChanged) {
            setOrder(newDefaults);
        }
    }, [optionCats, sortedOptions]);
    function handleChange(e) {
        const addOnPrice = Number(e.target.dataset.price || 0)
        if (e.target.type === "checkbox") {
            setOrder((prev) => ({ ...prev, [e.target.name]: e.target.checked }))
            if (e.target.checked) {
                setPrice(prev => (Number(prev) + addOnPrice).toFixed(2))
            } else {
                setPrice(prev => (Number(prev) - addOnPrice).toFixed(2))
            }

        } else {
            setOrder((prev) => ({ ...prev, [e.target.name]: e.target.value }))
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
                            if (cat["multiple"] == true) {
                                return (
                                    <div key={option["description"]}>
                                        <label htmlFor={option["description"]}>
                                            <input type="checkbox" name={option["description"]}
                                                onChange={handleChange}
                                                data-price={option["price"]}
                                                checked={order[option["description"]] || false} />
                                            {option["description"]} {option["price"] ? `(+£${option["price"]})` : "Free"}
                                        </label>
                                        <br />
                                    </div>
                                )
                            } else if (cat["required"] == true) {
                                return (<div key={option["description"]}>
                                    <label htmlFor={cat["description"]}>
                                        <input
                                            type="radio"
                                            name={cat["description"]}
                                            value={option["description"]}
                                            data-price={option["price"]}
                                            checked={order[cat["description"]] === option["description"]}
                                            onChange={handleChange}
                                        /> {option["description"]} {option["price"] ? `(£${option["price"]})` : "Free"}
                                    </label>
                                    <br />
                                </div>
                                )
                            } else {
                                console.log("Nah dige third option")
                                return (
                                    <div key={option["description"]}>
                                        <label htmlFor=""></label>
                                    </div>
                                )
                            }
                        })
                    }
                </div>)
        })}
    </form>)

}