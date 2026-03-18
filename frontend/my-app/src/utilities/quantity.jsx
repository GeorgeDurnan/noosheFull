import { useEffect, useState } from "react"
import style from "../components/item.module.css"

/**
 * Component to manage quantity selection and price calculation.
 * 
 * @param {Object} props
 * @param {Function} props.setPrice - Function to set individual item price (unused)
 * @param {number} props.price - Unit price of the item
 * @param {Function} props.setPrice2 - Function to update the total calculated price
 * @param {number|string} props.quantity - Current quantity value
 * @param {Function} props.setQuantity - Function to update the quantity state
 */
export const Quantity = ({ setPrice, price, setPrice2, quantity, setQuantity }) => {
    // Disable decrease button if quantity is 1 or less
    const canDecrease = quantity > 1

    /**
     * Increment or decrement quantity based on button value.
     * Buttons have value={1} or value={-1}.
     */
    function handleClick(event) {
        setQuantity(prev => Number(prev) + Number(event.target.value))
    }

    // Recalculate total price when quantity or unit price changes
    useEffect(() => {
        setPrice2(price * Number(Math.abs(quantity)))
    }, [quantity, price])

    /**
     * Handle manual input changes.
     * Manages empty strings to allow user editing while defaulting to 0.
     */
    function handleChange(event) {
        if (event.target.value === "") {
            if (quantity === "0" || quantity === 0) {
                setQuantity("") 
            } else {
                setQuantity(0) 
            }
        } else {
            setQuantity(event.target.value)
        }
    }

    // Enforce quantity limits (1-99) when input loses focus
    function handleBlur() {
        if (quantity < 1 || quantity > 99) {
            setQuantity(1)
        }
    }

    return (
        <div className={style.quantBtns}>
            <button value={-1} className={canDecrease ? "buttonOn" : "buttonOff"} onClick={canDecrease ? handleClick : null}>-</button>
            <input onBlur={handleBlur} type="number" value={quantity} onChange={handleChange} />
            <button value={1} onClick={handleClick}>+</button>
        </div>
    )
}