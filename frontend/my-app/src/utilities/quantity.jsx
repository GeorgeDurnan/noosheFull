import { useEffect, useState } from "react"
export const Quantity = ({ setPrice, price, setPrice2, quantity, setQuantity}) => {
    const canDecrease = quantity > 1
    function handleClick(event) {
        setQuantity(prev => Number(prev) + Number(event.target.value))


    }
    useEffect(() => {
        console.log("price" + price)
        setPrice2(price * Number(Math.abs(quantity)))
    }, [quantity, price])
    function handleChange(event) {
        if (event.target.value === "") {
            if (quantity === "0" || quantity === 0) {
                setQuantity("");
            } else {
                setQuantity(0);
            }
        } else {
            setQuantity(event.target.value)
        }

    }
    function handleBlur() {
        if (quantity < 1 || quantity > 99) {
            setQuantity(1)
        }
    }
    return (
        <div>
            <button value={-1} className={canDecrease ? "buttonOn" : "buttonOff"} onClick={canDecrease ? handleClick : null}>-</button>
            <input onBlur={handleBlur} type="number" value={quantity} onChange={handleChange} />
            <button value={1} onClick={handleClick}>+</button>
        </div>
    )
}