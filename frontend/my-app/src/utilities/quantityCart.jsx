import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { changeQuantity } from "../features/slices/cartSlice"
import { useRef } from "react"
export const QuantityCart = ({ item }) => {
    const [quantity, setQuantity] = useState(item.quantity)
    const [run, setRun] = useState(false)
    const canDecrease = quantity > 1
    const dispatch = useDispatch()
    const isFirstRender = useRef(true);
    function handleClick(event) {
        setQuantity(prev => Number(prev) + Number(event.target.value))
    }

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return
        }
        dispatch(changeQuantity({ item, quantity }))

    }, [quantity])
    function handleChange(event) {
        if (Number(event.target.value) && event.target.value !== 0) {
            setQuantity(event.target.value);
        } else {
            setQuantity(1)
        }

    }
    function handleBlur() {
        if (quantity < 1 || quantity > 99) {
            setQuantity(1)
        }
    }
    if (!item) {
        return (
            <h3>Your cart is empty</h3>
        )
    }
    return (
        <div>
            <button value={-1} className={canDecrease ? "buttonOn" : "buttonOff"} onClick={canDecrease ? handleClick : null}>-</button>
            <input onBlur={handleBlur} type="number" value={quantity} onChange={handleChange} />
            <button value={1} onClick={handleClick}>+</button>
        </div>
    )
}