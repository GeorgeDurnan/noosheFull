import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { changeQuantity } from "../../features/slices/cartSlice"
import { useRef } from "react"
import style from "./cart.module.css"
export const QuantityCart = ({ item }) => {
    // Local state for quantity management
    const [quantity, setQuantity] = useState(item.quantity)
    
    // Check if quantity can be decreased (must be greater than 1)
    const canDecrease = quantity > 1
    const dispatch = useDispatch()
    
    // Ref to track if it's the first render to avoid initial dispatch
    const isFirstRender = useRef(true) 
    
    // Handle click events for increase/decrease buttons
    function handleClick(event) {
        setQuantity(prev => Number(prev) + Number(event.target.value))
    }

    // Effect to dispatch quantity changes to Redux store
    // Skips the first render
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false 
            return
        }
        dispatch(changeQuantity({ item, quantity }))

    }, [quantity])

    // Handle manual input changes
    function handleChange(event) {
        if (Number(event.target.value) && event.target.value !== 0) {
            setQuantity(event.target.value) 
        } else {
            // Default to 1 if input is invalid or 0
            setQuantity(1)
        }

    }

    // Handle input blur to ensure quantity is within valid range (1-99)
    function handleBlur() {
        if (quantity < 1 || quantity > 99) {
            setQuantity(1)
        }
    }

    // Return message if no item exists
    if (!item) {
        return (
            <h3>Your cart is empty</h3>
        )
    }

    // Render quantity controls
    return (
        <div className={style.quantBtns}>
            <button value={-1} className={canDecrease ? "buttonOn" : "buttonOff"} onClick={canDecrease ? handleClick : null}>-</button>
            <input onBlur={handleBlur} type="number" value={quantity} onChange={handleChange} />
            <button value={1} onClick={handleClick}>+</button>
        </div>
    )
}