import { useSelector } from "react-redux"
import { getCart } from "../features/slices/cartSlice"
import { CartItem } from "./cartItem"
import { useEffect } from "react"
export const Cart = () => {
    const cart = useSelector(getCart) || {}
    return (
        <div>
            {Object.values(cart).map((item) => {
                return <CartItem key = {JSON.stringify(item)} item={item}/>
            })}
        </div>
    )
}