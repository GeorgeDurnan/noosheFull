import { useState } from "react"
export const MapOptions = ({ optionCats, sortedOptions, price, setPrice, basePrice }) => {
    const [order, setOrder] = useState({})
    const[currentBasePrice, setCurrentBasePrice] = useState(basePrice)
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
            if (!cat?.description || !sortedOptions) {
                console.log("Eh boba")
                return null
            }
            return (
                <div key={cat["description"]}>
                    <h1>{cat["description"]}</h1>
                    {
                        sortedOptions[cat["description"]].map((option) => {
                            if (cat["multi"] == true) {
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